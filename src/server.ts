import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.get('/link/:id', (req, res) => {
  const shareId = req.params['id'];

  const data = {
    title: 'Croac!',
    description:
      '📅 20 Dic • 5 PM | 🌿 Dresscode: Un poco verde | Acompáñanos en esta aventura anfibia.',
    imageUrl: 'https://eventa-invites--eventa-invites.us-east4.hosted.app/croac.webp',
  };
  const title = data.title;
  const description = data.description;
  const imageUrl = data.imageUrl; // Debe ser una URL absoluta (https://...)
  const current_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const redirect_url = `${current_url.replace('/lik/', '/invitacion/')}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${redirect_url}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #eb3b0fea 0%, #be1212ff 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
            }
            
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                max-width: 600px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
            }
            
            h1 {
                font-size: 2rem;
                margin-bottom: 20px;
                color: #be1212ff;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            p {
                margin: 15px 0;
                line-height: 1.6;
                color: #333333ff;
                font-size: 0.95rem;
            }
            
            a {
                color: #be1212ff;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s ease;
            }
            
            a:hover {
                color: #ff0000ff;
                text-decoration: underline;
            }
            
            .cta-button {
                display: inline-block;
                margin-top: 30px;
                padding: 12px 32px;
                background: #be1212;
                color: white !important;
                border-radius: 6px;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                text-decoration: none !important;
            }
            
            .cta-button:hover {
                background: #e20909ff;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(201, 41, 29, 0.3);
            }
            
            .whatsapp-link {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 20px;
                background: transparent;
                color: #25d366 !important;
                border: 2px solid #25d366;
                border-radius: 6px;
                font-weight: 600;
                transition: all 0.3s ease;
                text-decoration: none !important;
            }
            
            .whatsapp-link:hover {
                background: #25d366;
                color: white !important;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <script>
                // Redirigir a los humanos al sitio real
                window.location.href = "${redirect_url}";
            </script>
            <h1>Redirigiendo...</h1>
            <p>Si no eres redirigido automáticamente, haz clic <a href="${redirect_url}">aquí</a>.</p>
            <p>¿Por qué sigues leyendo esto? Haz click <a href="${redirect_url}">aquí</a> ya!</p>
            <p>Reconozco que esto es molesto, pero es necesario para que las redes sociales muestren la información correcta.</p>
            <a href="${redirect_url}" class="cta-button">Redirigir ahora</a>
            <a href="https://wa.me/59177914381?text=Oye!%20Tu%20redireccionador%20se%20rompió,%20me%20encontraba%20en%20${req.originalUrl}" class="whatsapp-link">Contactar por WhatsApp</a>
            <p>Sabias que todo este bloque redireccionador fue implementado por un robot? obviamente el diseño y los textos no, pero si los revisó multiples veces sin mi permiso, tuve que convencerle que este texto en el que le acuso, era necesario.</p>
        </div>
    </body>
    </html>
    `;

  res.send(html);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
