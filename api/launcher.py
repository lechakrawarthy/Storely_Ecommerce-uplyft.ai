#!/usr/bin/env python3
"""
Simple server launcher for testing
"""
import subprocess
import sys
import os
import time


def launch_server():
    """Launch the Flask server"""
    print("🚀 Launching Flask server...")

    # Start the server process
    process = subprocess.Popen(
        [sys.executable, "app_final.py"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    print(f"Server process started with PID: {process.pid}")
    print("Waiting 3 seconds for server to initialize...")
    time.sleep(3)

    # Check if process is still running
    if process.poll() is None:
        print("✅ Server appears to be running")
        return process
    else:
        print("❌ Server process has stopped")
        stdout, stderr = process.communicate()
        if stdout:
            print(f"STDOUT: {stdout}")
        if stderr:
            print(f"STDERR: {stderr}")
        return None


if __name__ == "__main__":
    server = launch_server()
    if server:
        try:
            # Keep the launcher running
            print("Server launcher active. Press Ctrl+C to stop...")
            server.wait()  # Wait for server to finish
        except KeyboardInterrupt:
            print("\n🛑 Stopping server...")
            server.terminate()
            server.wait()
            print("Server stopped")
    else:
        print("Failed to start server")
