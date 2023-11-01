
var disc = {
  comments: []
};

async function populate() {
  try {
    const response = await fetch("http://localhost:5050/city_info", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discussion: disc })
    });
    if (!response.ok) {
      throw new Error('Failed to update city info');
    }

    const data = await response.json();
    console.log('City info updated successfully:', data);
  } catch (error) {
    console.error('Error while updating city info:', error);
  }
}

populate();