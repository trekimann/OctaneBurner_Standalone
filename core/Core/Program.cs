using ElectronCgi.DotNet;
using System;
using System.IO;
using System.Net;

namespace Core
{
    class Program
    {
        static void Main(string[] args)
        {
            var log = new Logger(Directory.GetCurrentDirectory() + @"\log.txt");
            log.Log("--------------Starting new process--------------");
            var octaneApi = new octaneApi();
            var store = new details(log);
            var tasks = new Tasks(log);
            var connection = new ConnectionBuilder()
                .WithLogging()
                .Build();

            // load up cached values from a file if it exists
            store.loadFromFile();

            connection.On<string, string>("greeting", name => "Hello " + name);

            connection.On<dynamic, dynamic>("octaneApi", data => octaneApi.route(data));

            connection.On<dynamic, dynamic>("details", detail => store.update(detail));

            connection.On<dynamic, dynamic>("retrieve", arg => store.retrieve(arg));

            connection.On<dynamic, dynamic>("task", task => tasks.route(task));

            connection.Listen();
        }
    }

    class Tasks{
        private Logger Log {get;set;}
        public Tasks (Logger log){
                this.Log=log;
        }
        public dynamic route(dynamic task){
            // find which task task to do
            var target = task.target;
            switch(target){
                case "filterOwnerTasks": 
                    filterOwnerTasks(task.data);
                    break;
                default:
                    Log.Log("tasks: no route found");
                    break;
                
            }
            return null;
        }

        private dynamic filterOwnerTasks(dynamic tasks){
            Log.Log("Filter owner tasks: "+tasks);
            return null;
        }
    }

    class Logger{  
        private string logpath {get;set;}
        public Logger(string LogPath){
            this.logpath = LogPath;
        }
        public void Log(string contents){
            string time = DateTime.Now.TimeOfDay.ToString();
            string fullLog = time +"\t--\t"+contents;
            using (StreamWriter sw = File.AppendText(logpath)) 
        {
            sw.WriteLine(fullLog);
        }	            
        }

    }

    class details
    {
        private Logger Log {get;set;}
        public details(Logger log){
                this.Log = log;
        }
        
        public string UserId { get; private set;}
        public string Username { get; private set; }
        public string WorkspaceId { get; private set; }
        public string TaskInProgress { get; private set; }
        string path = Directory.GetCurrentDirectory();
        string userCache = Directory.GetCurrentDirectory() + @"\userDetails.txt";
        

        public dynamic update(dynamic details)
        {
            Log.Log("updating values: Starting");
            try{
            // check what property to update
            string property = details.property;
            // update it - use reflection for this properly, for now just using an if
            // if(property == "Username") {
            //     Username = details.value;
            //     Log.Log("updating values: Username - "+Username);
            // }else if (property == "WorkspaceId"){
            //     WorkspaceId = details.value;
            //     Log.Log("updating values: WorkspaceId - "+WorkspaceId);
            // }else if (property == "TaskInProgress"){
            //     TaskInProgress = details.value;
            //     Log.Log("updating values: TaskInProgress - "+TaskInProgress);
            // }

            switch(property){
                case "Username":{
                    Username = details.value;
                    break;}
                case "WorkspaceId":{
                    WorkspaceId = details.value;
                    break;}
                case "TaskInProgress":{
                    TaskInProgress = details.value;
                    break;}
                case "UserId":{
                    UserId = details.value;
                    break;}
            }
               

            Log.Log("updating values: "+property +"- "+details.value);
            saveDetails();
            Log.Log("updating values: Finished");
            return details.value;}
            catch(Exception e){
                System.Console.WriteLine(e.ToString());
                 Log.Log("Update: Exception "+e.ToString());
                return null;
            }
        }

        public dynamic retrieve(dynamic arg){
            Log.Log("retrieve values: Starting");
            string target = arg.target;
            string toReturn = "NotFound";
            if(target == "USERNAME"){
                toReturn = Username; Log.Log("retrieve values: retrieved username - "+Username);
            }else if(target == "WORKSPACEID"){
                toReturn = WorkspaceId; Log.Log("updating values: retrieved workspaceId - "+WorkspaceId);
            }
            Log.Log("retrieve values: finished");
            return toReturn;
        }

        public void loadFromFile(){
            Log.Log("loadFromFile: starting");
            string raw = System.IO.File.ReadAllText(userCache);
            // user reflection to read this in, for now just hardcoded
            var properties = raw.Split(",");
            foreach(string prop in properties){
                string[] contents = prop.Split(":");
                if(contents[0] == "USERNAME"){
                    Username = contents[1];
                     Log.Log("loadFromFile: Username - "+Username);
                }else if (contents[0]=="WORKSPACEID"){
                    WorkspaceId = contents[1];
                     Log.Log("loadFromFile: Workspaceid - "+WorkspaceId);
                };
            }
             Log.Log("loadFromFile: Finished");
        }

        private string saveDetails(){
             Log.Log("SaveDetails: starting");
            // use reflection properly but for now just do it manually to test
            
            string text = "USERNAME:" + Username +","+ Environment.NewLine;
            text = text + "WORKSPACEID:" + WorkspaceId +","+ Environment.NewLine;
            text = text + "USERID:"+UserId+",";

            System.IO.File.WriteAllText(userCache, text);
             Log.Log("loadFromFile: Finished");
            return null;
        }

    }
    class octaneApi
    {
        public string route(dynamic data)
        {
            try
            {
                string toReturn = "";
                if (data.endpoint == "workspaceId")
                {
                    string url = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces";
                    toReturn = Get(url);
                }
                return toReturn;
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        private string Get(string uri)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    return reader.ReadToEnd();
                }
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }
    }
}
