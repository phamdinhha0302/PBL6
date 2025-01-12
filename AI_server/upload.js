document
  .getElementById("imageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    // Prepare FormData to send the image file
    const formData = new FormData();
    formData.append("image", file);

    // Send POST request to the API
    fetch("http://127.0.0.1:4444/detect", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        // Display the results
        document.getElementById("category").textContent =
          data.predicted_category;

        const probabilitiesList = document.getElementById("probabilities");
        probabilitiesList.innerHTML = ""; // Clear previous probabilities

        data.probabilities.forEach((probability) => {
          const listItem = document.createElement("li");
          listItem.textContent = probability;
          probabilitiesList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while processing the image.");
      });
  });
