try:
    print("Testing controller import...")
    from services.controller import APIController
    print("SUCCESS: APIController imported")

    controller = APIController()
    print("SUCCESS: APIController instantiated")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
