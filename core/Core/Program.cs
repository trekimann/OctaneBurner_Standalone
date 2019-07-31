using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Net;
using ElectronCgi.DotNet;
using Newtonsoft.Json;

namespace Core {
    class Program {
        static void Main (string[] args) {
            var log = new Logger (Directory.GetCurrentDirectory () + @"\log.txt");
            log.Log ("--------------Starting new process--------------");
            var octaneApi = new octaneApi ();
            var store = new Details (log);
            var tasks = new Tasks (log, store);
            var user = new userDetails (log, store);

            var connection = new ConnectionBuilder ()
                .WithLogging ()
                .Build ();

            // load up cached values from a file if it exists
            store.loadFromFile ();

            connection.On<string, string> ("greeting", name => "Hello " + name);

            connection.On<dynamic, dynamic> ("octaneApi", data => octaneApi.route (data));

            connection.On<dynamic, dynamic> ("details", detail => store.update (detail));

            connection.On<dynamic, dynamic> ("retrieve", arg => store.retrieve (arg));

            connection.On<dynamic, dynamic> ("user", use => user.route (use));

            connection.On<dynamic, dynamic> ("task", task => tasks.route (task));

            connection.Listen ();
        }
    }

    class userDetails {
        private Logger Log { get; set; }
        private Details dets { get; set; }
        public userDetails (Logger log, Details de) {
            this.Log = log;
            this.dets = de;
        }

        public dynamic route (dynamic request) {
            string target = request.target.ToString ();
            dynamic toReturn = null;
            switch (target) {
                case "findUserId":
                    {
                        toReturn = findUserId (dets.Username, request.data);
                        break;
                    }
            }

            return toReturn;
        }
        public string findUserId (string target, dynamic userResponse) {
            Dictionary<string, dynamic> userList = new Dictionary<string, dynamic> ();

            string toReturn = "";
            // Pull apart the json message from octane into objects.
            dynamic UserInfo = JsonConvert.DeserializeObject<ExpandoObject> (userResponse.Value.ToString ());
            var users = UserInfo.data;
            // look though each one for the user who logged in. 
            // while here create in memory list of users. Dictionary with id as key. user object as value
            foreach (var person in users) {
                var email = person.email;
                var ID = person.id;
                if (email == target) {
                    toReturn = ID;
                }
                userList.Add (ID, person);
            }

            // update the data store with the ID
            dynamic update = new ExpandoObject ();
            update.property = "UserId";
            update.value = toReturn;
            dets.update (update);

            update = new ExpandoObject ();
            update.property = "UserList";
            update.value = userList;
            dets.update (update);

            // return the userId 

            return toReturn;
        }
    }

    class Tasks {
        private Logger Log { get; set; }
        private Details Dets { get; set; }

        private Dictionary<string, dynamic> allTasks { get; set; } = new Dictionary<string, dynamic> ();
        private Dictionary<string, dynamic> userTasks { get; set; } = new Dictionary<string, dynamic> ();
        public List<string> taskList { get; private set; } = new List<string> ();
        public Tasks (Logger log, Details dets) {
            this.Log = log;
            this.Dets = dets;
        }
        public dynamic route (dynamic task) {
            // find which task task to do
            var target = task.target.ToString ();
            Log.Log ("Task Route: " + target);
            switch (target) {
                case "filterOwnerTasks":
                    filterOwnerTasks (task.data);
                    break;
                default:
                    Log.Log ("tasks: no route found for " + target);
                    break;
            }
            return null;
        }

        private dynamic filterOwnerTasks (dynamic RawTasks) {
            // create an object for each task, check if the userID is the one we want.
            dynamic taskInfo = JsonConvert.DeserializeObject<ExpandoObject> (RawTasks.Value.ToString ());
            // if (allTasks == null) {
            //     allTasks = taskInfo.data;
            // } else {
            //     allTasks.add(taskInfo.data);
            // }
            string userId = Dets.UserId;

            foreach (var task in taskInfo.data) {
                var owner = task.owner;
                allTasks.Add(task.id,task);
                if (owner != null) {
                    var ownerId = owner.id;
                    if (ownerId == userId) {
                        taskList.Add (task.id);
                    }
                }
            }
            // Log.Log ("Filter owner tasks: " + taskInfo.GetType ());
            return null;
        }
    }

    class Logger {
        private string logpath { get; set; }
        private bool shouldLog { get; set; } = false;
        public Logger (string LogPath) {
            this.logpath = LogPath;
        }

        public void Log (string contents) {
            if (shouldLog) {
                string time = DateTime.Now.TimeOfDay.ToString ();
                string fullLog = time + "\t--\t" + contents;
                try {
                    using (StreamWriter sw = File.AppendText (logpath)) {
                        sw.WriteLine (fullLog);
                    }
                } catch (Exception e) {
                    System.Console.WriteLine (e.ToString ());
                }
            }
        }

    }

    class Details {
        private Logger Log { get; set; }
        public Details (Logger log) {
            this.Log = log;
        }

        public string UserId { get; private set; }
        public string Username { get; private set; }
        public string WorkspaceId { get; private set; }
        public string TaskInProgress { get; private set; }
        public string path { get; private set; } = Directory.GetCurrentDirectory ();
        public string userCache { get; private set; } = Directory.GetCurrentDirectory () + @"\userDetails.txt";
        public Dictionary<string, dynamic> userList { get; private set; } = new Dictionary<string, dynamic> ();

        public dynamic update (dynamic details) {
            Log.Log ("updating values: Starting");
            try {
                // check what property to update
                string property = details.property;

                switch (property) {
                    case "Username":
                        {
                            Username = details.value;
                            break;
                        }
                    case "WorkspaceId":
                        {
                            WorkspaceId = details.value;
                            break;
                        }
                    case "TaskInProgress":
                        {
                            TaskInProgress = details.value;
                            break;
                        }
                    case "UserId":
                        {
                            UserId = details.value;
                            break;
                        }
                    case "UserList":
                        {
                            userList = details.value;
                            break;
                        }
                }

                Log.Log ("updating values:\t" + property + " - " + details.value);
                saveDetails ();
                Log.Log ("updating values: Finished");
                return details.value;
            } catch (Exception e) {
                System.Console.WriteLine (e.ToString ());
                Log.Log ("Update: Exception " + e.ToString ());
                return null;
            }
        }

        public dynamic retrieve (dynamic arg) {
            Log.Log ("retrieve values: Starting");
            string target = arg.target;
            string toReturn = "NotFound";
            switch (target) {
                case "USERNAME":
                    {
                        toReturn = Username;
                        break;
                    }
                case "WORKSPACEID":
                    {
                        toReturn = WorkspaceId;
                        break;
                    }
                case "TASKINPROGRESS":
                    {
                        toReturn = TaskInProgress;
                        break;
                    }
                case "USERID":
                    {
                        toReturn = UserId;
                        break;
                    }
            }
            Log.Log ("retrieve values: retrieved " + target + " - " + toReturn);
            return toReturn;
        }

        public void loadFromFile () {
            Log.Log ("loadFromFile: Starting");
            string raw = System.IO.File.ReadAllText (userCache);
            // user reflection to read this in, for now just hardcoded
            var properties = raw.Split (",");
            foreach (string prop in properties) {
                string[] contents = prop.Split (":");
                try {
                    Log.Log ("loadFromFile: " + contents[0] + " - " + contents[1]);
                } catch (Exception e) {
                    e.ToString ();
                };
                if (contents[0] == "USERNAME") {
                    Username = contents[1];
                } else if (contents[0] == "WORKSPACEID") {
                    WorkspaceId = contents[1];
                } else if (contents[0] == "USERID") {
                    UserId = contents[1];
                };
            }
            Log.Log ("loadFromFile: Finished");
        }

        private string saveDetails () {
            Log.Log ("SaveDetails: starting");
            // use reflection properly but for now just do it manually to test

            string text = "USERNAME:" + Username + "," + Environment.NewLine;
            text = text + "WORKSPACEID:" + WorkspaceId + "," + Environment.NewLine;
            text = text + "USERID:" + UserId + ",";

            System.IO.File.WriteAllText (userCache, text);
            Log.Log ("loadFromFile: Finished");
            return null;
        }

    }
    class octaneApi {
        public string route (dynamic data) {
            try {
                string toReturn = "";
                if (data.endpoint == "workspaceId") {
                    string url = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces";
                    toReturn = Get (url);
                }
                return toReturn;
            } catch (Exception e) {
                return e.ToString ();
            }
        }

        private string Get (string uri) {
            try {
                HttpWebRequest request = (HttpWebRequest) WebRequest.Create (uri);
                request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

                using (HttpWebResponse response = (HttpWebResponse) request.GetResponse ())
                using (Stream stream = response.GetResponseStream ())
                using (StreamReader reader = new StreamReader (stream)) {
                    return reader.ReadToEnd ();
                }
            } catch (Exception e) {
                return e.ToString ();
            }
        }
    }
}