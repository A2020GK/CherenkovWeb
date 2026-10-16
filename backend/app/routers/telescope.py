from fastapi import APIRouter

router = APIRouter(prefix="/telescope", tags=["Telescope"])

@router.get("/list")
async def get_telescopes():
    """Get a list of all telescopes."""
    return [
        {"id": 1, "name": "Telescope 1", "location": "Location 1"},
        {"id": 2, "name": "Telescope 2", "location": "Location 2"},
        {"id": 3, "name": "Telescope 3", "location": "Location 3"},
    ]