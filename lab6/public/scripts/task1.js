const galleryItems = [
  {
    imageURL: "https://picsum.photos/id/1018/900/600",
    title: "Forest Stream",
    category: "Nature",
    description: "A calm stream moving through a green forest."
  },
  {
    imageURL: "https://picsum.photos/id/1025/900/600",
    title: "Curious Parrot",
    category: "Animals",
    description: "A colorful parrot resting on a branch."
  },
  {
    imageURL: "https://picsum.photos/id/1031/900/600",
    title: "City Tower",
    category: "Architecture",
    description: "A modern tower rising above the city blocks."
  },
  {
    imageURL: "https://picsum.photos/id/1043/900/600",
    title: "Mountain Route",
    category: "Nature",
    description: "A hiking path with mountain views at sunset."
  },
  {
    imageURL: "https://picsum.photos/id/1060/900/600",
    title: "Street Cat",
    category: "Animals",
    description: "A cat watching passersby from a sidewalk."
  },
  {
    imageURL: "https://picsum.photos/id/1076/900/600",
    title: "Historic Hall",
    category: "Architecture",
    description: "An old hall with arches and carved windows."
  },
  {
    imageURL: "https://picsum.photos/id/1084/900/600",
    title: "Lakeside Trees",
    category: "Nature",
    description: "Trees mirrored on a peaceful lakeside."
  },
  {
    imageURL: "https://picsum.photos/id/237/900/600",
    title: "Friendly Dog",
    category: "Animals",
    description: "A friendly dog looking directly at the camera."
  },
  {
    imageURL: "https://picsum.photos/id/1063/900/600",
    title: "Glass Building",
    category: "Architecture",
    description: "A glass-front building reflecting the sky."
  }
];

const filterControls = document.querySelector("#filterControls");
const galleryGrid = document.querySelector("#galleryGrid");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const closeModalBtn = document.querySelector("#closeModal");

let activeCategory = "All";

function createFilterButtons() {
  const categories = ["All", ...new Set(galleryItems.map((item) => item.category))];
  const fragment = document.createDocumentFragment();

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category;
    button.className = "pill";
    button.dataset.category = category;
    if (category === activeCategory) {
      button.classList.add("active");
    }
    fragment.appendChild(button);
  });

  filterControls.appendChild(fragment);
}

function createCard(item, index) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.dataset.index = String(index);
  card.dataset.category = item.category;
  card.innerHTML = `
    <img src="${item.imageURL}" alt="${item.title}">
    <div class="gallery-card-body">
      <h3>${item.title}</h3>
      <span class="gallery-meta">${item.category}</span>
    </div>
  `;
  return card;
}

function renderGallery() {
  const fragment = document.createDocumentFragment();
  galleryGrid.innerHTML = "";

  galleryItems.forEach((item, index) => {
    const categoryMatches =
      activeCategory === "All" || item.category === activeCategory;
    if (categoryMatches) {
      fragment.appendChild(createCard(item, index));
    }
  });

  galleryGrid.appendChild(fragment);
}

function animateFiltering(nextCategory) {
  galleryGrid.classList.add("filter-fade");
  setTimeout(() => {
    activeCategory = nextCategory;
    renderGallery();
    galleryGrid.classList.remove("filter-fade");
  }, 180);
}

function openModal(item) {
  modalImage.src = item.imageURL;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  imageModal.classList.remove("hidden");
  imageModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  imageModal.classList.add("hidden");
  imageModal.setAttribute("aria-hidden", "true");
}

filterControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) {
    return;
  }

  const selectedCategory = button.dataset.category;
  if (!selectedCategory || selectedCategory === activeCategory) {
    return;
  }

  filterControls
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  animateFiltering(selectedCategory);
});

galleryGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".gallery-card");
  if (!card) {
    return;
  }

  const index = Number.parseInt(card.dataset.index, 10);
  const selectedItem = galleryItems[index];
  if (selectedItem) {
    openModal(selectedItem);
  }
});

closeModalBtn.addEventListener("click", closeModal);

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeModal();
  }
});

createFilterButtons();
renderGallery();
