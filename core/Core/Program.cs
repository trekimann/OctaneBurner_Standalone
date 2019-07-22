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
            string logPath = Directory.GetCurrentDirectory() + @"\sharpError.log";
            var octaneApi = new octaneApi();
            var connection = new ConnectionBuilder()
                .WithLogging(logPath)
                .Build();

            connection.On<string, string>("greeting", name => "Hello " + name);

            connection.On<dynamic, dynamic>("octaneApi", data => octaneApi.route(data));

            connection.Listen();
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
