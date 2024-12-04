class Program
{
  static void Main()
  {
    string[] recordNames = [];
    int[] recordScores = [];

    int port = 5000;

    var server = new Server(port);

    Console.WriteLine("The server is running");
    Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

      if (File.Exists(request.Path))
      {
        var file = new File(request.Path);
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file);
      }
      else
      {
        try
        {
          /*──────────────────────────────────╮
          │ Handle your custome requests here │
          ╰──────────────────────────────────*/
          if (request.Path == "addRecord")
          {
            (string userId, int score) = request.GetBody<(string, int)>();

            int i = 0;
            while (i < recordScores.Length && recordScores[i] > score)
            {
              i++;
            }

            recordNames = [.. recordNames[..i], userId, .. recordNames[i..]];
            recordScores = [.. recordScores[..i], score, .. recordScores[i..]];
          }
          else if (request.Path == "getRecords")
          {
            response.Send((recordNames, recordScores));
          }
          else
          {
            response.SetStatusCode(405);
          }
        }
        catch (Exception exception)
        {
          Log.WriteException(exception);
        }
      }

      response.Close();
    }
  }
}