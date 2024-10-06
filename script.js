document.addEventListener("DOMContentLoaded", function () {
  // Get the SVG element directly by its ID
  const svgDocument = document.getElementById("svg1");

  // Find all <path> elements within the SVG
  const sections = svgDocument.querySelectorAll("path");

  if (sections.length === 0) {
    console.warn("No <path> elements found in SVG.");
  } else {
    console.log(`Found ${sections.length} path elements.`);
  }

  // Variable to store the currently selected section
  let selectedSection = null;

  // Randomly select three sections where fires will be displayed
  const fireSections = getRandomFireSections(sections, 3);

  // Iterate over all sections and add event handlers
  sections.forEach((section) => {
    // Get the ID of the current section
    const sectionId = section.getAttribute("id");
    if (!sectionId) {
      console.warn("Found an element without an ID, skipping.");
      return;
    }

    // Generate and store information for each section
    const info = generateRandomInfo(sectionId);
    section.sectionInfo = info;

    // Add a special attribute for sections with fire
    if (fireSections.includes(sectionId)) {
      section.setAttribute("data-fire", "true"); // Add attribute to identify fire
      addFireIcon(section); // Add fire icon
    }

    // If air quality is "Hazardous", add CO₂ icon
    if (info.airQuality === "Hazardous") {
      addCo2Icon(section); // Add CO₂ icon
    }

    // Apply section style based on air quality at load
    applySectionStyleBasedOnAirQuality(section, info.airQuality, false);

    // Add click event handler to the section
    section.addEventListener("click", function () {
      // Deselect the previously selected section if it exists
      if (selectedSection) {
        // Reset the previous section's style based on its air quality
        applySectionStyleBasedOnAirQuality(
          selectedSection,
          selectedSection.sectionInfo.airQuality,
          false
        );
      }

      // Set the current section as selected
      selectedSection = section;

      // Get the section's information
      const info = section.sectionInfo;

      // Apply style to the section based on air quality and mark it as selected
      applySectionStyleBasedOnAirQuality(section, info.airQuality, true);

      // Display information
      displayInfo(info);

      // If the section has a fire icon, remove it
      if (section.fireIcon) {
        section.fireIcon.remove();
        section.fireIcon = null;
      }
    });

    // Add hover effect to the section
    section.addEventListener("mouseenter", function () {
      section.style.fillOpacity = 0.7; // Change opacity on hover
    });
    section.addEventListener("mouseleave", function () {
      // If the section is not selected, reset its opacity
      if (selectedSection !== section) {
        section.style.fillOpacity = 1.0; // Restore original opacity
      }
    });
  });

  // Function to generate random information for a map section
  function generateRandomInfo(sectionId) {
    // Possible air quality values
    const airQualityOptions = ["Good", "Moderate", "Hazardous"];

    // Randomly generate air quality
    const airQuality =
      airQualityOptions[Math.floor(Math.random() * airQualityOptions.length)];

    // Check if there is a fire in this section
    const fireStatus = fireSections.includes(sectionId)
      ? "Fire detected"
      : "No fire";

    // Return an object with the information to be displayed
    return {
      section: sectionId,
      airQuality: airQuality,
      fireStatus: fireStatus,
      temperature: (15 + Math.random() * 10).toFixed(1) + " °C",
    };
  }

  // Function to display information in the info box
  function displayInfo(info) {
    const infoBox = document.getElementById("info-box");
    // Form the HTML content to display the selected section's information
    let warningMessage = "";

    // If air quality is hazardous, add a warning
    if (info.airQuality === "Hazardous") {
      warningMessage = `<strong style="color: red;">Warning! This area is hazardous. It is not recommended to go there.</strong>`;
    }

    // If there is a fire in this section, add a message that a rover has been sent
    if (info.fireStatus === "Fire detected") {
      warningMessage += `<br><strong style="color: orange;">Fire detected. Our rover has been dispatched to check this area.</strong>`;
    }

    infoBox.innerHTML = `
                <strong>Section:</strong> ${info.section}<br>
                <strong>Air Quality:</strong> ${info.airQuality}<br>
                <strong>Fire:</strong> ${info.fireStatus}<br>
                <strong>Temperature:</strong> ${info.temperature}<br>
                ${warningMessage}
            `;

    // Adjust styles for infoBox to stand out
    infoBox.style.color = "white";
    infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    infoBox.style.border = "1px solid white";
    infoBox.style.fontSize = "18px"; // Increase text size
  }

  // Function to change the style of a section based on air quality
  function applySectionStyleBasedOnAirQuality(section, airQuality, isSelected) {
    let fillColor;
    let strokeColor;
    let strokeWidth;

    if (airQuality === "Good") {
      fillColor = isSelected ? "#00FF00" : "#66FF66"; // Bright green
      strokeColor = "#009900";
      strokeWidth = isSelected ? "3" : "1";
    } else if (airQuality === "Moderate") {
      fillColor = isSelected ? "#FFFF00" : "#FFFF99"; // Bright yellow
      strokeColor = "#999900";
      strokeWidth = isSelected ? "3" : "1";
    } else if (airQuality === "Hazardous") {
      fillColor = isSelected ? "#FF0000" : "#FF6666"; // Bright red
      strokeColor = "#990000";
      strokeWidth = isSelected ? "3" : "2";
    }

    // Apply styles to the section
    section.style.fill = fillColor;
    section.style.stroke = strokeColor;
    section.style.strokeWidth = strokeWidth;
    section.style.fillOpacity = 1.0; // Set opacity to 1
  }

  // Function to randomly select sections where fires will be displayed
  function getRandomFireSections(sections, count) {
    const sectionIds = Array.from(sections).map((section) =>
      section.getAttribute("id")
    );
    const fireSections = [];

    while (fireSections.length < count) {
      const randomIndex = Math.floor(Math.random() * sectionIds.length);
      const randomSectionId = sectionIds[randomIndex];

      if (!fireSections.includes(randomSectionId)) {
        fireSections.push(randomSectionId);
      }
    }

    return fireSections;
  }

  // Function to add a fire icon to sections with fires
  function addFireIcon(section) {
    const fireIcon = document.createElement("img");
    fireIcon.src = "iconfire.png"; // Path to fire icon
    fireIcon.style.position = "absolute";
    fireIcon.style.width = "20px";
    fireIcon.style.height = "20px";

    // Position the icon over the section
    const rect = section.getBoundingClientRect();
    fireIcon.style.left = `${
      rect.left + window.scrollX + rect.width / 2 - 10
    }px`;
    fireIcon.style.top = `${
      rect.top + window.scrollY + rect.height / 2 - 10
    }px`;

    // Add the icon to the map container
    document.body.appendChild(fireIcon);

    // Save a reference to the icon in the section for later removal
    section.fireIcon = fireIcon;
  }

  // Function to add a CO₂ icon to sections with poor air quality
  function addCo2Icon(section) {
    const co2Icon = document.createElement("img");
    co2Icon.src = "co2.png"; // Path to CO₂ icon
    co2Icon.style.position = "absolute";
    co2Icon.style.width = "20px";
    co2Icon.style.height = "20px";

    // Position the icon over the section
    const rect = section.getBoundingClientRect();
    co2Icon.style.left = `${
      rect.left + window.scrollX + rect.width / 2 - 10
    }px`;
    co2Icon.style.top = `${rect.top + window.scrollY + rect.height / 2 - 10}px`;

    // Add the icon to the map container
    document.body.appendChild(co2Icon);

    // Save a reference to the icon in the section if needed for further actions
    section.co2Icon = co2Icon;
  }
});
