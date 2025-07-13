#!/usr/bin/env python3

"""
Simple HTTP Server for Loom4 Development
Usage: python3 server.py [port]
"""

import http.server
import socketserver
import os
import sys
import mimetypes
from urllib.parse import urlparse
import json

class Loom4HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler for Loom4 application"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Default to index.html for root path
        if path == '/':
            path = '/index.html'
        
        # Security check - prevent directory traversal
        if '..' in path:
            self.send_error(403, "Forbidden: Directory traversal not allowed")
            return
        
        # Remove leading slash
        file_path = path.lstrip('/')
        full_path = os.path.join(os.getcwd(), file_path)
        
        # Check if file exists
        if not os.path.exists(full_path) or os.path.isdir(full_path):
            self.send_404_response(path)
            return
        
        try:
            # Determine content type
            content_type = self.get_content_type(file_path)
            
            # Read and serve the file
            with open(full_path, 'rb') as f:
                content = f.read()
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            
            # Add CORS headers for development
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.send_header('Cache-Control', 'no-cache')
            
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            print(f"Error serving {path}: {e}")
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def get_content_type(self, file_path):
        """Get the appropriate content type for a file"""
        # Get mime type
        content_type, _ = mimetypes.guess_type(file_path)
        
        # Handle specific cases
        if file_path.endswith('.js'):
            content_type = 'text/javascript'
        elif file_path.endswith('.css'):
            content_type = 'text/css'
        elif file_path.endswith('.html'):
            content_type = 'text/html'
        elif file_path.endswith('.json'):
            content_type = 'application/json'
        elif content_type is None:
            content_type = 'text/plain'
        
        return content_type
    
    def send_404_response(self, path):
        """Send a custom 404 response"""
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found - Loom4</title>
    <style>
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 40px; background: #f8fafc; color: #2d3748;
        }}
        .container {{ 
            max-width: 600px; margin: 0 auto; background: white; 
            padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        h1 {{ color: #e53e3e; font-size: 2rem; margin-bottom: 20px; }}
        .code {{ background: #f7fafc; padding: 10px; border-radius: 6px; font-family: monospace; }}
        a {{ color: #3182ce; text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>404 Not Found</h1>
        <p>The requested file <span class="code">{path}</span> was not found.</p>
        <p><a href="/">← Return to Loom4 Application</a></p>
    </div>
</body>
</html>"""
        
        self.send_response(404)
        self.send_header('Content-Type', 'text/html')
        self.send_header('Content-Length', str(len(html_content)))
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.address_string()}] {format % args}")

def main():
    """Main server function"""
    # Get port from command line arguments or default to 8080
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    
    # Get current directory
    doc_root = os.getcwd()
    
    print("Starting Loom4 Development Server...")
    print(f"Document Root: {doc_root}")
    print(f"Server URL: http://localhost:{port}")
    print(f"Main Application: http://localhost:{port}/index.html")
    print("Press Ctrl+C to stop the server\n")
    
    # Create server
    try:
        with socketserver.TCPServer(("", port), Loom4HTTPRequestHandler) as httpd:
            print(f"Server started successfully on port {port}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Error: Port {port} is already in use. Try a different port:")
            print(f"python3 server.py {port + 1}")
        else:
            print(f"Error starting server: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()