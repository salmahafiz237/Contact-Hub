// cruds operation

// C => Creation
// R => reterive | read
// U => Update
// D => Delete
// S => Search

var htmlElements = {
    contactName: document.getElementById("contactName"),
    contactPhone: document.getElementById("contactPhone"),
    contactEmail: document.getElementById("contactEmail"),
    contactAddress: document.getElementById("contactAddress"),
    contactGroup: document.getElementById("contactGroup"),
    contactNotes: document.getElementById("contactNotes"),
    contactFavorite: document.getElementById("contactFavorite"),
    contactEmergency: document.getElementById("contactEmergency"),
    avatarPreview: document.getElementById("avatarPreview"),
    avatarInput: document.getElementById("avatarInput"),
    contactModal: document.getElementById("contactModal"),
    modalTitle: document.getElementById("modalTitle"),
    addBtn: document.getElementById("addBtn"),
    updateBtn: document.getElementById("updateBtn"),
    contactsGrid: document.getElementById("contactsGrid"),
    favoritesList: document.getElementById("favoritesList"),
    favoritesListMobile: document.getElementById("favoritesListMobile"),
    emergencyList: document.getElementById("emergencyList"),
    emergencyListMobile: document.getElementById("emergencyListMobile"),
    totalCount: document.getElementById("totalCount"),
    favoriteCount: document.getElementById("favoriteCount"),
    emergencyCount: document.getElementById("emergencyCount"),
    contactsCountText: document.getElementById("contactsCountText"),
    search: document.getElementById("searchInput")
};

var contactList = JSON.parse(localStorage.getItem("contacts")) || [];
var globalIndex;
var uploadedAvatarData = "";
var avatarColors = [
    "linear-gradient(to bottom right, #60a5fa, #2563eb)",
    "linear-gradient(to bottom right, #34d399, #059669)",
    "linear-gradient(to bottom right, #fbbf24, #f97316)",
    "linear-gradient(to bottom right, #f472b6, #db2777)",
    "linear-gradient(to bottom right, #a78bfa, #7c3aed)",
    "linear-gradient(to bottom right, #f87171, #dc2626)"
];

// global variable
displayAllContacts();

// ================ Creation ================
function addNewContact() {
    var isNameValid = validateAllInput(htmlElements.contactName);
    var isPhoneValid = validateAllInput(htmlElements.contactPhone);
    var isEmailValid = validateAllInput(htmlElements.contactEmail);

    if (isNameValid && isPhoneValid && isEmailValid) {
        var newContact = {
            name: htmlElements.contactName.value.trim(),
            phone: htmlElements.contactPhone.value.trim(),
            email: htmlElements.contactEmail.value.trim(),
            address: htmlElements.contactAddress.value.trim(),
            group: htmlElements.contactGroup.value,
            notes: htmlElements.contactNotes.value.trim(),
            favorite: htmlElements.contactFavorite.checked,
            emergency: htmlElements.contactEmergency.checked,
            avatar: uploadedAvatarData
        };
        contactList.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contactList));
        displayAllContacts();
        clearForm();
        hideModal();
    }
}

// ==============clear============
function clearForm() {
    htmlElements.contactName.value = "";
    htmlElements.contactPhone.value = "";
    htmlElements.contactEmail.value = "";
    htmlElements.contactAddress.value = "";
    htmlElements.contactGroup.value = "";
    htmlElements.contactNotes.value = "";
    htmlElements.contactFavorite.checked = false;
    htmlElements.contactEmergency.checked = false;
    htmlElements.avatarInput.value = "";
    htmlElements.avatarPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
    uploadedAvatarData = "";
    globalIndex = undefined;

    var fields = [htmlElements.contactName, htmlElements.contactPhone, htmlElements.contactEmail];
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].classList.remove("is-valid", "is-invalid");
        fields[i].nextElementSibling.classList.add("d-none");
    }

    htmlElements.addBtn.classList.remove('d-none');
    htmlElements.updateBtn.classList.add('d-none');
}

// ==============avatar helpers============
function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    var initials = "";
    var i;
    for (i = 0; i < parts.length && i < 2; i++) {
        initials += parts[i].charAt(0).toUpperCase();
    }
    return initials;
}

function colorForIndex(index) {
    return avatarColors[index % avatarColors.length];
}

function handleAvatarUpload(event) {
    var file = event.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        uploadedAvatarData = e.target.result;
        htmlElements.avatarPreview.innerHTML = '<img src="' + uploadedAvatarData + '" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    };
    reader.readAsDataURL(file);
}

// =========display data & search =============
function displayAllContacts(element) {
    var text = element ? element.value : "";
    var box = '';
    var i;

    for (i = 0; i < contactList.length; i++) {
        var contact = contactList[i];
        var matches = contact.name.toLowerCase().includes(text.toLowerCase()) ||
            contact.phone.toLowerCase().includes(text.toLowerCase()) ||
            contact.email.toLowerCase().includes(text.toLowerCase());

        if (matches) {
            var avatarHtml = contact.avatar
                ? `<img src="${contact.avatar}" class="contact-avatar" alt="${contact.name}">`
                : `<div class="contact-avatar" style="background:${colorForIndex(i)}">${getInitials(contact.name)}</div>`;

            var favBadge = contact.favorite ? `<span class="avatar-badge avatar-badge-fav"><i class="fa-solid fa-star"></i></span>` : '';
            var emergencyBadge = contact.emergency ? `<span class="avatar-badge avatar-badge-emergency"><i class="fa-solid fa-heart-pulse"></i></span>` : '';

            var emailRow = contact.email ? `<div class="contact-row"><span class="row-icon row-icon-purple"><i class="fa-solid fa-envelope"></i></span><span>${contact.email}</span></div>` : '';
            var addressRow = contact.address ? `<div class="contact-row"><span class="row-icon row-icon-teal"><i class="fa-solid fa-location-dot"></i></span><span>${contact.address}</span></div>` : '';

            var groupBadge = contact.group ? `<span class="badge-group">${contact.group}</span>` : '';
            var emergencyPill = contact.emergency ? `<span class="badge-emergency"><i class="fa-solid fa-heart-pulse"></i>Emergency</span>` : '';

            box += `
                <div class="col-md-6">
                    <div class="contact-card">
                        <div class="contact-card-top">
                            <div class="contact-avatar-wrap">
                                ${avatarHtml}
                                ${favBadge}
                                ${emergencyBadge}
                            </div>
                            <div class="flex-grow-1 min-width-0">
                                <p class="contact-name">${contact.name}</p>
                                <div class="contact-row"><span class="row-icon row-icon-blue"><i class="fa-solid fa-phone"></i></span><span>${contact.phone}</span></div>
                                ${emailRow}
                                ${addressRow}
                                <div class="contact-badges">${groupBadge}${emergencyPill}</div>
                            </div>
                        </div>
                        <div class="contact-card-actions">
                            <div class="actions-left">
                                <button type="button" class="action-circle action-circle-green" title="Call"><i class="fa-solid fa-phone"></i></button>
                                <button type="button" class="action-circle action-circle-purple" title="Email"><i class="fa-solid fa-envelope"></i></button>
                            </div>
                            <div class="actions-right">
                                <button type="button" class="action-square${contact.favorite ? ' active-fav' : ''}" onclick="toggleFavorite(${i})" title="Toggle favorite"><i class="fa-solid fa-star"></i></button>
                                <button type="button" class="action-square${contact.emergency ? ' active-emergency' : ''}" onclick="toggleEmergency(${i})" title="Toggle emergency"><i class="fa-solid fa-heart-pulse"></i></button>
                                <button type="button" class="action-square" onclick="fillInputWithData(${i})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="action-square delete-btn" onclick="deleteThisContact(${i})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    if (box === '') {
        box = `
            <div class="col-12 empty-state">
                <div class="empty-icon"><i class="fa-solid fa-address-book"></i></div>
                <p class="empty-title">No contacts found</p>
                <p class="empty-subtitle">Click "Add Contact" to get started</p>
            </div>
        `;
    }

    htmlElements.contactsGrid.innerHTML = box;

    displaySideList(htmlElements.favoritesList, "favorite", "No favorites yet");
    displaySideList(htmlElements.favoritesListMobile, "favorite", "No favorites yet");
    displaySideList(htmlElements.emergencyList, "emergency", "No emergency contacts");
    displaySideList(htmlElements.emergencyListMobile, "emergency", "No emergency contacts");

    updateStats();
}

// ================ Sidebar lists ================
function displaySideList(container, flagKey, emptyMessage) {
    var box = '';
    var i;
    for (i = 0; i < contactList.length; i++) {
        var contact = contactList[i];
        if (contact[flagKey]) {
            var avatarHtml = contact.avatar
                ? `<img src="${contact.avatar}" class="side-item-avatar" alt="${contact.name}">`
                : `<div class="side-item-avatar" style="background:${colorForIndex(i)}">${getInitials(contact.name)}</div>`;

            box += `
                <div class="side-item" onclick="fillInputWithData(${i})">
                    ${avatarHtml}
                    <div class="min-width-0">
                        <p class="side-item-name">${contact.name}</p>
                        <p class="side-item-phone">${contact.phone}</p>
                    </div>
                    <button type="button" class="side-item-call" title="Call" onclick="event.stopPropagation()"><i class="fa-solid fa-phone"></i></button>
                </div>
            `;
        }
    }
    container.innerHTML = box === '' ? `<div class="side-empty">${emptyMessage}</div>` : box;
}

// ================ Stats ================
function updateStats() {
    var total = contactList.length;
    var favorites = 0;
    var emergency = 0;
    var i;
    for (i = 0; i < contactList.length; i++) {
        if (contactList[i].favorite) {
            favorites++;
        }
        if (contactList[i].emergency) {
            emergency++;
        }
    }
    htmlElements.totalCount.textContent = total;
    htmlElements.favoriteCount.textContent = favorites;
    htmlElements.emergencyCount.textContent = emergency;
    htmlElements.contactsCountText.textContent = total;
}

//================Delete function===============
var deleteIndex = null;

function deleteThisContact(index) {
    deleteIndex = index;
    document.getElementById("deleteContactName").textContent = contactList[index].name;
    document.getElementById("deleteModal").classList.add("show");
    document.body.style.overflow = "hidden";
}

function hideDeleteModal() {
    document.getElementById("deleteModal").classList.remove("show");
    document.body.style.overflow = "";
    deleteIndex = null;
}

function confirmDelete() {
    if (deleteIndex === null) {
        return;
    }
    contactList.splice(deleteIndex, 1);
    localStorage.setItem('contacts', JSON.stringify(contactList));
    displayAllContacts(htmlElements.search);
    hideDeleteModal();
}

//================Favorite / Emergency toggles===============
function toggleFavorite(index) {
    contactList[index].favorite = !contactList[index].favorite;
    localStorage.setItem('contacts', JSON.stringify(contactList));
    displayAllContacts(htmlElements.search);
}

function toggleEmergency(index) {
    contactList[index].emergency = !contactList[index].emergency;
    localStorage.setItem('contacts', JSON.stringify(contactList));
    displayAllContacts(htmlElements.search);
}

//============= fill Input With Data ===============
function fillInputWithData(index) {
    globalIndex = index;
    htmlElements.contactName.value = contactList[index].name;
    htmlElements.contactPhone.value = contactList[index].phone;
    htmlElements.contactEmail.value = contactList[index].email;
    htmlElements.contactAddress.value = contactList[index].address;
    htmlElements.contactGroup.value = contactList[index].group;
    htmlElements.contactNotes.value = contactList[index].notes;
    htmlElements.contactFavorite.checked = !!contactList[index].favorite;
    htmlElements.contactEmergency.checked = !!contactList[index].emergency;

    uploadedAvatarData = contactList[index].avatar || "";
    htmlElements.avatarPreview.innerHTML = uploadedAvatarData
        ? '<img src="' + uploadedAvatarData + '" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
        : '<i class="fa-solid fa-user"></i>';

    htmlElements.modalTitle.textContent = "Edit Contact";
    htmlElements.addBtn.classList.add('d-none');
    htmlElements.updateBtn.classList.remove('d-none');

    showModal();
}

// ================== Update ==================
function updateThisItem() {
    var isNameValid = validateAllInput(htmlElements.contactName);
    var isPhoneValid = validateAllInput(htmlElements.contactPhone);
    var isEmailValid = validateAllInput(htmlElements.contactEmail);

    if (isNameValid && isPhoneValid && isEmailValid) {
        var updatedContact = {
            name: htmlElements.contactName.value.trim(),
            phone: htmlElements.contactPhone.value.trim(),
            email: htmlElements.contactEmail.value.trim(),
            address: htmlElements.contactAddress.value.trim(),
            group: htmlElements.contactGroup.value,
            notes: htmlElements.contactNotes.value.trim(),
            favorite: htmlElements.contactFavorite.checked,
            emergency: htmlElements.contactEmergency.checked,
            avatar: uploadedAvatarData
        };
        contactList[globalIndex] = updatedContact;
        localStorage.setItem('contacts', JSON.stringify(contactList));
        displayAllContacts();
        clearForm();
        hideModal();
    }
}

// ================== modal show/hide ==================
function openAddModal() {
    clearForm();
    htmlElements.modalTitle.textContent = "Add New Contact";
    htmlElements.addBtn.classList.remove('d-none');
    htmlElements.updateBtn.classList.add('d-none');
    showModal();
}

function showModal() {
    htmlElements.contactModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function hideModal() {
    htmlElements.contactModal.classList.remove("show");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        hideModal();
        hideDeleteModal();
    }
});

// ====================== validation =======================

function validateAllInput(element) {
    var regex = {
        contactName: /^[a-zA-Z\s]{2,50}$/,
        contactPhone: /^01[0125][0-9]{8}$/,
        contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
    var alertMsgs = element.nextElementSibling;
    var isOptionalEmpty = element.id === "contactEmail" && element.value.trim() === "";

    if (isOptionalEmpty || regex[element.id].test(element.value.trim())) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        alertMsgs.classList.add("d-none");
        return true;
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        alertMsgs.classList.remove("d-none");
        return false;
    }
}