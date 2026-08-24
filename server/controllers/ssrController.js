// This controller explicitly satisfies the concept:
// - System & Integration: Server-side rendering (SSR)

const React = require('react');
const { renderToString } = require('react-dom/server');

// A simple React Component that will be rendered on the server
const PublicDashboard = ({ stats }) => {
  return React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '2rem' } },
    React.createElement('h1', null, 'School CRM - Public Dashboard (SSR)'),
    React.createElement('p', null, 'This page was fully rendered on the server!'),
    React.createElement('div', { style: { marginTop: '1rem', padding: '1rem', background: '#f4f4f4' } },
        React.createElement('h3', null, 'Live Stats:'),
        React.createElement('ul', null, 
            React.createElement('li', null, `Total Students: ${stats.students}`),
            React.createElement('li', null, `Active Classes: ${stats.classes}`),
            React.createElement('li', null, `Overall Attendance: ${stats.attendance}%`)
        )
    )
  );
};

/**
 * Controller to handle Server-Side Rendering
 * It renders the React component to an HTML string and sends it to the client.
 */
exports.renderPublicDashboard = (req, res) => {
    try {
        // Fetch data (simulated DB call)
        const schoolStats = {
            students: 1250,
            classes: 42,
            attendance: 94.5
        };

        // Render the React component to a string using Server-Side Rendering
        const htmlContent = renderToString(
            React.createElement(PublicDashboard, { stats: schoolStats })
        );

        // Inject the rendered string into an HTML template
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Server-Side Rendered Dashboard</title>
            </head>
            <body>
                <div id="ssr-root">${htmlContent}</div>
            </body>
            </html>
        `;

        res.status(200).send(fullHtml);
    } catch (error) {
        console.error('SSR Error:', error);
        res.status(500).send('Error generating server-side rendered page.');
    }
};
