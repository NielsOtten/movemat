
/* eslint-disable prefer-template, max-len */

export default vo => `

<!DOCTYPE html>
<html lang="en">

  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <meta httpEquiv="Content-Language" content="nl" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link id="favicon" rel="shortcut icon" href="/kyt-favicon.png" sizes="16x16 32x32" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css">
    <link rel="stylesheet" type="text/css" href="/styles/popup.css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400" rel="stylesheet">
    ${vo.cssBundle ? '<link rel="stylesheet" type="text/css" href="' + vo.cssBundle + '">' : ''}

    <title>Steps</title>
  </head>

  <body>
    <div id="root"><div>${vo.root}</div></div>
    <script>
    var __passportErrors = ${JSON.stringify(vo.errors)};
    </script>
    <script src="${vo.jsBundle}"></script>
  </body>

</html>

`;
