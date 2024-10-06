document.addEventListener("DOMContentLoaded", function () {
  const svgDocument = document.getElementById("svg1");
  const sections = svgDocument.querySelectorAll("path");

  if (sections.length === 0) {
    console.warn("No <path> elements found in SVG.");
  } else {
    console.log(`Found ${sections.length} path elements.`);
  }

  let selectedSection = null;
  const fireSections = getRandomFireSections(sections, 3);

  sections.forEach((section) => {
    const sectionId = section.getAttribute("id");
    if (!sectionId) {
      console.warn("Found an element without an ID, skipping.");
      return;
    }

    const info = generateRandomInfo(sectionId);
    section.sectionInfo = info;

    if (fireSections.includes(sectionId)) {
      section.setAttribute("data-fire", "true");
      addFireIcon(section);
    }

    if (info.airQuality === "Hazardous") {
      addCo2Icon(section);
    }

    applySectionStyleBasedOnAirQuality(section, info.airQuality, false);

    section.addEventListener("click", function () {
      if (selectedSection) {
        applySectionStyleBasedOnAirQuality(
          selectedSection,
          selectedSection.sectionInfo.airQuality,
          false
        );
      }

      selectedSection = section;
      const info = section.sectionInfo;
      applySectionStyleBasedOnAirQuality(section, info.airQuality, true);
      displayInfo(info);

      if (section.fireIcon) {
        section.fireIcon.remove();
        section.fireIcon = null;
      }
    });

    section.addEventListener("mouseenter", function () {
      section.style.fillOpacity = 0.7;
    });
    section.addEventListener("mouseleave", function () {
      if (selectedSection !== section) {
        section.style.fillOpacity = 1.0;
      }
    });
  });

  function generateRandomInfo(sectionId) {
    const airQualityOptions = ["Good", "Moderate", "Hazardous"];
    const airQuality =
      airQualityOptions[Math.floor(Math.random() * airQualityOptions.length)];

    const fireStatus = fireSections.includes(sectionId)
      ? "Fire detected"
      : "No fire";

    return {
      section: sectionId,
      airQuality: airQuality,
      fireStatus: fireStatus,
      temperature: (15 + Math.random() * 10).toFixed(1) + " °C",
    };
  }

  function displayInfo(info) {
    const infoBox = document.getElementById("info-box");
    let warningMessage = "";

    if (info.airQuality === "Hazardous") {
      warningMessage = `<strong style="color: red;">Warning! This area is hazardous. It is not recommended to go there.</strong>`;
    }

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

    infoBox.style.color = "white";
    infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    infoBox.style.border = "1px solid white";
    infoBox.style.fontSize = "18px";
  }

  function applySectionStyleBasedOnAirQuality(section, airQuality, isSelected) {
    let fillColor;
    let strokeColor;
    let strokeWidth;

    if (airQuality === "Good") {
      fillColor = isSelected ? "#00FF00" : "#66FF66";
      strokeColor = "#009900";
      strokeWidth = isSelected ? "3" : "1";
    } else if (airQuality === "Moderate") {
      fillColor = isSelected ? "#FFFF00" : "#FFFF99";
      strokeColor = "#999900";
      strokeWidth = isSelected ? "3" : "1";
    } else if (airQuality === "Hazardous") {
      fillColor = isSelected ? "#FF0000" : "#FF6666";
      strokeColor = "#990000";
      strokeWidth = isSelected ? "3" : "2";
    }

    section.style.fill = fillColor;
    section.style.stroke = strokeColor;
    section.style.strokeWidth = strokeWidth;
    section.style.fillOpacity = 1.0;
  }

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

  function addFireIcon(section) {
    const fireIcon = document.createElement("img");
    fireIcon.src = "iconfire.png";
    fireIcon.style.position = "absolute";
    fireIcon.style.width = "20px";
    fireIcon.style.height = "20px";

    const rect = section.getBoundingClientRect();
    fireIcon.style.left = `${
      rect.left + window.scrollX + rect.width / 2 - 10
    }px`;
    fireIcon.style.top = `${
      rect.top + window.scrollY + rect.height / 2 - 10
    }px`;

    document.body.appendChild(fireIcon);
    section.fireIcon = fireIcon;
  }

  function addCo2Icon(section) {
    const co2Icon = document.createElement("img");
    co2Icon.src = "co2.png";
    co2Icon.style.position = "absolute";
    co2Icon.style.width = "20px";
    co2Icon.style.height = "20px";

    const rect = section.getBoundingClientRect();
    co2Icon.style.left = `${
      rect.left + window.scrollX + rect.width / 2 - 10
    }px`;
    co2Icon.style.top = `${rect.top + window.scrollY + rect.height / 2 - 10}px`;

    document.body.appendChild(co2Icon);
    section.co2Icon = co2Icon;
  }
});
