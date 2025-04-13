/**
 * Resume Builder Form Handler
 * Handles functionality for Form.html: template preview, dynamic fields,
 * data collection, and saving to localStorage.
 */
const ResumeFormHandler = (function () {
    let templateId = '1'; let experienceCounter = 1; let educationCounter = 1;
    const templateNames = { '1': 'Minimalist', '2': 'Modern', '3': 'Executive', '4': 'Creative', '5': 'Classic' };
    const templateImageUrls = { '1': 'PTKJp.png', '2': 's8edP.png', '3': 'gKxSF.png', '4': 'wKmEG.png', '5': 'q6gRZ.png' };
    const imageBaseUrl = 'https://v0.blob.com/';
    function init() {
        const urlParams = new URLSearchParams(window.location.search); const selectedTemplateParam = urlParams.get('template');
        if (selectedTemplateParam && templateNames[selectedTemplateParam]) { templateId = selectedTemplateParam; }
        else { console.warn(`Invalid template ID: ${selectedTemplateParam}. Defaulting to ${templateId}.`); }
        updateTemplatePreview(); setupEventListeners();
    }
    function updateTemplatePreview() {
        const nameElement = document.getElementById('templateName'); const imgElement = document.getElementById('templatePreview');
        if (nameElement) { nameElement.textContent = templateNames[templateId] || 'Unknown'; }
        if (imgElement) {
            if (templateImageUrls[templateId]) { imgElement.src = imageBaseUrl + templateImageUrls[templateId]; imgElement.alt = `${templateNames[templateId] || 'Selected'} Preview`; imgElement.style.display = ''; }
            else { imgElement.src = ''; imgElement.alt = 'Preview unavailable'; imgElement.style.display = 'none'; }
        }
    }
    function setupEventListeners() {
        const addExpBtn = document.getElementById('addExperience'); const addEduBtn = document.getElementById('addEducation'); const form = document.getElementById('resumeForm');
        const expFieldsContainer = document.getElementById('experienceFields'); const eduFieldsContainer = document.getElementById('educationFields');
        if (addExpBtn) addExpBtn.addEventListener('click', addExperienceField); if (addEduBtn) addEduBtn.addEventListener('click', addEducationField); if (form) form.addEventListener('submit', handleFormSubmit);
        if (expFieldsContainer) expFieldsContainer.addEventListener('click', handleRemoveClick); if (eduFieldsContainer) eduFieldsContainer.addEventListener('click', handleRemoveClick);
    }
    function handleRemoveClick(event) {
        const removeButton = event.target.closest('.remove-entry');
        if (removeButton) { const entry = removeButton.closest('.experience-entry, .education-entry'); if (entry) entry.remove(); }
    }
    function addExperienceField() {
        const container = document.getElementById('experienceFields'); if (!container) return;
        const entry = document.createElement('div'); entry.className = 'experience-entry'; const id = experienceCounter++;
        entry.innerHTML = `<div class="form-group"><label for="expPosition${id}">Position</label><input type="text" id="expPosition${id}" name="expPosition[]" class="form-control position-title" required></div> <div class="form-group"><label for="expCompany${id}">Company</label><input type="text" id="expCompany${id}" name="expCompany[]" class="form-control company" required></div> <div class="form-group"><label for="expDuration${id}">Duration</label><input type="text" id="expDuration${id}" name="expDuration[]" class="form-control duration" placeholder="MM/YYYY - Present"></div> <div class="form-group"><label for="expResponsibilities${id}">Responsibilities</label><textarea id="expResponsibilities${id}" name="expResponsibilities[]" class="form-control responsibilities" rows="3"></textarea><small>New lines = bullets.</small></div> <button type="button" class="btn btn-danger btn-sm remove-entry">Remove</button><div style="clear: both;"></div>`;
        container.appendChild(entry);
    }
    function addEducationField() {
        const container = document.getElementById('educationFields'); if (!container) return;
        const entry = document.createElement('div'); entry.className = 'education-entry'; const id = educationCounter++;
        entry.innerHTML = `<div class="form-group"><label for="eduDegree${id}">Degree</label><input type="text" id="eduDegree${id}" name="eduDegree[]" class="form-control degree" required></div> <div class="form-group"><label for="eduInstitution${id}">Institution</label><input type="text" id="eduInstitution${id}" name="eduInstitution[]" class="form-control institution" required></div> <div class="form-group"><label for="eduDuration${id}">Duration</label><input type="text" id="eduDuration${id}" name="eduDuration[]" class="form-control duration" placeholder="YYYY - YYYY"></div> <button type="button" class="btn btn-danger btn-sm remove-entry">Remove</button><div style="clear: both;"></div>`;
        container.appendChild(entry);
    }
    function handleFormSubmit(event) {
        event.preventDefault(); const getValue = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        const formData = { template: templateId, fullName: getValue('fullName'), professionalTitle: getValue('professionalTitle'), email: getValue('email'), phone: getValue('phone'), website: getValue('website'), address: getValue('address'), overview: getValue('overview'), skills: getValue('skills'), experience: [], education: [] };
        document.querySelectorAll('#experienceFields .experience-entry').forEach(e => { const p = e.querySelector('.position-title'); if (p && p.value.trim()) formData.experience.push({ position: p.value.trim(), company: e.querySelector('.company')?.value.trim() ?? '', duration: e.querySelector('.duration')?.value.trim() ?? '', responsibilities: e.querySelector('.responsibilities')?.value ?? '' }); });
        document.querySelectorAll('#educationFields .education-entry').forEach(e => { const d = e.querySelector('.degree'); if (d && d.value.trim()) formData.education.push({ degree: d.value.trim(), institution: e.querySelector('.institution')?.value.trim() ?? '', duration: e.querySelector('.duration')?.value.trim() ?? '' }); });
        try { localStorage.setItem('resumeData', JSON.stringify(formData)); console.log('Data saved:', formData); window.location.href = 'resume.html'; }
        catch (error) { console.error("Save Error:", error); alert("Could not save data."); }
    }
    return { init: init };
})();
document.addEventListener('DOMContentLoaded', ResumeFormHandler.init);
