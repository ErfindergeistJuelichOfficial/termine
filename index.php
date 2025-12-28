<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Erfindergeist Jülich e.V. Termine</title>
    <link rel="stylesheet" href="./bootstrap.min.css">
    <link rel="stylesheet" href="./calender.css">
    <link rel="icon" href="./favicon.ico" type="image/x-icon">
  </head>
  <body>
    <main>
      
      <?PHP
        // Sichere Validierung des page-Parameters
        $allowedPages = ['all', 'picture'];
        $page = isset($_GET['page']) ? $_GET['page'] : 'all';
        
        // Nur erlaubte Werte akzeptieren
        if (!in_array($page, $allowedPages, true)) {
            $page = 'all';
        }
        
        switch ($page) {
          case  $allowedPages[1]:
            include_once('template_picture.html');
            break;
          case $allowedPages[0]:
          default:
            include_once('template_all.html');
            break;
        }
      ?>
    
      <div
        style="margin-left: auto; margin-right: auto"
        id="egj_calendar_container"
      >
        template loading...
      </div>

      <div class="container m-2 no-print" style="z-index: 100">
        <button id="egj_print_Button"type="button" class="btn btn-primary">Drucken</button>
        <button onclick="location.href='./index.php';" type="button" class="btn btn-primary">Alle Termine</button>
        <button onclick="location.href='./index.php?page=picture';" type="button" class="btn btn-primary">Termine mit Hintergrund</button>
        
        <br>
        
        <div class="mb-3">
          <label for="egj_custom_template_area" class="form-label">Template Editieren</label>
          <textarea class="form-control" id="egj_custom_template_area" rows="3"></textarea>
        </div>


        <p>Roh Daten</p>
        <pre id="egj_calendar_data"></pre>
      </div>
    </main>
    
    <script src="https://erfindergeist.org/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
    <script src="https://erfindergeist.org/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
    <script src="./handlebars.js?ver=4.7.8" id="handlebars-js"></script>
    <script src="./calendar.js?ver=2.2"></script>
  </body>
</html>