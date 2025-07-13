#!/usr/bin/env Rscript

# Simple HTTP Server for Loom4 Development
# Usage: Rscript server.R [port]

# Load required libraries
if (!require("httpuv", quietly = TRUE)) {
  install.packages("httpuv")
  library(httpuv)
}

if (!require("mime", quietly = TRUE)) {
  install.packages("mime")
  library(mime)
}

# Get port from command line arguments or default to 8080
args <- commandArgs(trailingOnly = TRUE)
port <- if (length(args) > 0) as.numeric(args[1]) else 8080

# Get current working directory as document root
doc_root <- getwd()

# MIME type mapping
get_content_type <- function(path) {
  ext <- tools::file_ext(path)
  content_type <- mime::guess_type(path)
  
  # Handle specific cases
  if (ext == "js") content_type <- "text/javascript"
  if (ext == "css") content_type <- "text/css"
  if (ext == "html") content_type <- "text/html"
  if (ext == "json") content_type <- "application/json"
  
  return(content_type)
}

# HTTP request handler
http_handler <- function(req) {
  # Parse the requested path
  path <- req$PATH_INFO
  if (path == "/") path <- "/index.html"  # Default to main index
  
  # Remove leading slash and construct full file path
  file_path <- file.path(doc_root, substring(path, 2))
  
  # Security check - prevent directory traversal
  if (grepl("\\.\\.", path)) {
    return(list(
      status = 403L,
      headers = list("Content-Type" = "text/plain"),
      body = "Forbidden: Directory traversal not allowed"
    ))
  }
  
  # Check if file exists
  if (!file.exists(file_path) || file.info(file_path)$isdir) {
    return(list(
      status = 404L,
      headers = list("Content-Type" = "text/html"),
      body = paste0(
        "<!DOCTYPE html>",
        "<html><head><title>404 Not Found</title></head>",
        "<body><h1>404 Not Found</h1>",
        "<p>The requested file <code>", path, "</code> was not found.</p>",
        "<p><a href='/'>Return to Loom4 Enhanced</a></p>",
        "</body></html>"
      )
    ))
  }
  
  # Read file content
  tryCatch({
    content_type <- get_content_type(file_path)
    
    # Read file as binary for non-text files
    if (grepl("^(image|audio|video|application/pdf)", content_type)) {
      file_content <- readBin(file_path, "raw", file.info(file_path)$size)
    } else {
      file_content <- paste(readLines(file_path, warn = FALSE), collapse = "\n")
    }
    
    # Add CORS headers for development
    headers <- list(
      "Content-Type" = content_type,
      "Access-Control-Allow-Origin" = "*",
      "Access-Control-Allow-Methods" = "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers" = "Content-Type, Authorization",
      "Cache-Control" = "no-cache"
    )
    
    return(list(
      status = 200L,
      headers = headers,
      body = file_content
    ))
    
  }, error = function(e) {
    return(list(
      status = 500L,
      headers = list("Content-Type" = "text/plain"),
      body = paste("Internal Server Error:", e$message)
    ))
  })
}

# WebSocket handler (optional for future use)
websocket_handler <- function(ws) {
  ws$onMessage(function(binary, message) {
    cat("WebSocket message received:", message, "\n")
    ws$send(paste("Echo:", message))
  })
  
  ws$onClose(function() {
    cat("WebSocket connection closed\n")
  })
}

# Start the server
cat("Starting Loom4 Development Server...\n")
cat("Document Root:", doc_root, "\n")
cat("Server URL: http://localhost:", port, "\n", sep = "")
cat("Main Application: http://localhost:", port, "/index.html\n", sep = "")
cat("Press Ctrl+C to stop the server\n\n")

# Create and start the server
server <- startServer(
  host = "0.0.0.0",
  port = port,
  app = list(
    call = http_handler,
    onWSOpen = websocket_handler
  )
)

# Keep the server running
tryCatch({
  while (TRUE) {
    service()
    Sys.sleep(0.1)
  }
}, interrupt = function(e) {
  cat("\nShutting down server...\n")
  stopServer(server)
  cat("Server stopped.\n")
})