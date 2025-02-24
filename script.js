document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resumeForm");

    // Generate Resume
    if (form) {
        document.getElementById("generateResume").addEventListener("click", (e) => {
            e.preventDefault();

            // Collect Form Data
            const formData = {
                name: document.getElementById("name").value,
                profile: document.getElementById("profile").value,
                contact: document.getElementById("contact").value,
                email: document.getElementById("email").value,
                address: document.getElementById("address").value,
                languages: document.getElementById("languages").value.split(",").map(lang => lang.trim()),
                hobbies: document.getElementById("hobbies").value.split(",").map(hobby => hobby.trim()),
                skills: document.getElementById("skills").value.split(",").map(skill => skill.trim()),
                projects: document.getElementById("projects").value.split(",").map(project => project.trim()),
                certifications: document.getElementById("certifications").value.split(",").map(cert => cert.trim()),
                education: Array.from(document.querySelectorAll(".education-entry")).map(entry => ({
                    school: entry.querySelector(".school")?.value || "",
                    degree: entry.querySelector(".degree")?.value || "",
                    cgpa: entry.querySelector(".CGPA")?.value || "",
                    startDate: entry.querySelector(".start-date")?.value || "",
                    endDate: entry.querySelector(".end-date")?.value || ""
                }))
            };

            // Handle Profile Image Upload
            const profileImageInput = document.getElementById("profileImage");
            const profileImage = profileImageInput?.files[0];

            if (profileImage) {
                const reader = new FileReader();
                reader.onload = () => {
                    formData.profileImage = reader.result;  
                    saveAndRedirect(formData);
                };
                reader.readAsDataURL(profileImage);
            } else {
                saveAndRedirect(formData);
            }
        });
    }

    // Save Data to Local Storage and Redirect
    function saveAndRedirect(data) {
        localStorage.setItem("resumeData", JSON.stringify(data));
        window.location.href = "index.html";  
    }

    // Load Data on index.html
    if (window.location.href.includes("index.html")) {
        const resumeData = JSON.parse(localStorage.getItem("resumeData"));

        if (resumeData) {
            document.getElementById("name").innerText = resumeData.name || "";
            document.getElementById("profile").innerText = resumeData.profile || "";
            document.getElementById("contact").innerText = `📞 ${resumeData.contact || ""}`;
            document.getElementById("email").innerText = `✉️ ${resumeData.email || ""}`;
            document.getElementById("address").innerText = ` ${resumeData.address || ""}`;

            document.getElementById("languages").innerHTML = resumeData.languages.map(lang => `<li>${lang}</li>`).join('');
            document.getElementById("hobbies").innerHTML = resumeData.hobbies.map(hobby => `<li>${hobby}</li>`).join('');
            document.getElementById("skills").innerHTML = resumeData.skills.map(skill => `<li>${skill}</li>`).join('');
            document.getElementById("projects").innerHTML = resumeData.projects.map(project => `<li>${project}</li>`).join('');
            document.getElementById("certifications").innerHTML = resumeData.certifications.map(cert => `<li>${cert}</li>`).join('');

            // Display Education
            const educationSection = document.getElementById("education");
            if (educationSection) {
                educationSection.innerHTML = resumeData.education.map(edu =>
                    `<p><strong>${edu.school}</strong>  <b>${edu.degree}</b>  <br>CGPA:${edu.cgpa}  (${edu.startDate} - ${edu.endDate})</p>`
                ).join('');
            }

            // Display Profile Image
            if (resumeData.profileImage) {
                const imgDisplay = document.getElementById("profileImageDisplay");
                if (imgDisplay) imgDisplay.src = resumeData.profileImage;
            }
        }
    }

    // Add Education 
    const addEducationBtn = document.getElementById("addEducation");
    if (addEducationBtn) {
        addEducationBtn.addEventListener("click", () => {
            const container = document.getElementById("educationContainer");
            const newEntry = document.createElement("div");
            newEntry.classList.add("education-entry");
            newEntry.innerHTML = `
                <label>School:</label>
                <input type="text" class="school" placeholder="School Name" required>
                <label>Degree:</label>
                <input type="text" class="degree" placeholder="Degree" required>
                <label>CGPA:</label>
                <input type="number" class="CGPA" placeholder="CGPA" required>
                <label>Start Date:</label>
                <input type="date" class="start-date" required>
                <label>End Date:</label>
                <input type="date" class="end-date" required>
                <button type="button" class="removeEducation">Remove</button>
            `;
            container.appendChild(newEntry);
        });
    }

    // Remove Education 
    document.getElementById("educationContainer")?.addEventListener("click", (e) => {
        if (e.target.classList.contains("removeEducation")) {
            e.target.parentElement.remove();
        }
    });

    // Download Resume as PDF
    document.getElementById("downloadResume").addEventListener("click", function () {
        // Ensure jsPDF and html2canvas are available
        if (window.jspdf && html2canvas) {
            const { jsPDF } = window.jspdf;
    
            // Convert the resume container to a PDF
            html2canvas(document.getElementById("resumeContainer")).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
    
                // Create a new PDF document (A4 size)
                const pdf = new jsPDF("p", "mm", "a4");
    
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width; 
    
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                pdf.save("resume.pdf"); // Download the PDF
            }).catch(error => {
                console.error("Error generating PDF:", error);
            });
        } else {
            alert("Error: Required libraries not loaded properly.");
        }
    });
});
