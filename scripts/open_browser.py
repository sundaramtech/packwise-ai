"""Wait for both local servers before opening the PackWise UI."""
import socket
import sys
import time
import urllib.error
import urllib.request
import webbrowser

URL = "http://127.0.0.1:3000"
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def check_ports():
    for port in (8000, 3000):
        with socket.socket() as sock:
            try:
                sock.bind(("127.0.0.1", port))
            except OSError:
                print(f"ERROR: Port {port} is already in use. Close existing app server windows and try again.")
                return 1
    return 0


def ready(url):
    try:
        with OPENER.open(url, timeout=2) as response:
            return response.status == 200
    except (OSError, urllib.error.URLError):
        return False


def main():
    if "--check-ports" in sys.argv:
        return check_ports()
    print("Waiting for backend and frontend (up to 90 seconds)...", flush=True)
    deadline = time.monotonic() + 90
    while time.monotonic() < deadline:
        if ready("http://127.0.0.1:8000/docs") and ready(URL):
            if not webbrowser.open(URL):
                print(f"Browser could not open automatically. Open {URL} manually.")
            return 0
        time.sleep(1)
    print("ERROR: Servers did not become ready. Check both server windows for errors.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
