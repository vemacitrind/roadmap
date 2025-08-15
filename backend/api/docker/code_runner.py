import os
import subprocess
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.conf import settings

@api_view(["POST"])
def run_code(request):
    """
    Handles POST requests to run code in a Docker container.
    Supports Python and Java.
    """
    language = request.data.get("language")
    code = request.data.get("code")

    if not language or not code:
        return JsonResponse({"error": "Language and code are required"}, status=400)

    if language not in ["python", "java"]:
        return JsonResponse({"error": "Unsupported language"}, status=400)

    temp_dir_base = os.path.join(settings.BASE_DIR, "tmp")
    
    import uuid
    request_dir = os.path.join(temp_dir_base, str(uuid.uuid4()))
    os.makedirs(request_dir, exist_ok=True)

    try:
        host_user_uid = os.getuid()

        cmd = None
        if language == "python":
            file_path = os.path.join(request_dir, "main.py")
            with open(file_path, "w") as f:
                f.write(code)
            
            cmd = ["docker", "run", "--rm", "-u", str(host_user_uid),
                   "-v", f"{os.path.abspath(request_dir)}:/app", "code_runner",
                   "python3", "/app/main.py"]

        elif language == "java":
            file_path = os.path.join(request_dir, "Main.java")
            with open(file_path, "w") as f:
                f.write(code)
            
            cmd = ["docker", "run", "--rm", "-u", str(host_user_uid),
                   "-v", f"{os.path.abspath(request_dir)}:/app", "code_runner",
                   "bash", "-c", "javac /app/Main.java && java -cp /app Main"]
        
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, timeout=5)
        
        return JsonResponse({"output": output.decode()})

    except subprocess.CalledProcessError as e:
        return JsonResponse({"error": e.output.decode()})
    except subprocess.TimeoutExpired:
        return JsonResponse({"error": "Execution timed out"})
    finally:
        import shutil
        if os.path.exists(request_dir):
            shutil.rmtree(request_dir)