document.addEventListener("DOMContentLoaded", () => {
  console.log('Script loaded, JavaScript is running.');
  console.log('Adding Sign In/Register buttons');
  // ----- Backendless Initialization -----
  Backendless.initApp(
    "A33C4544-3EA3-40F5-9373-C30AD3163696",
    "00582F4D-AA36-4053-8D41-2C6C9F9C4F03"
  );

  // ----- Utility -----

  // Helper to check if an element exists
  function el(id) {
    return document.getElementById(id);
  }

  // ----- Mobile Menu Toggle -----
  const mobileMenuBtn = el("mobileMenuBtn");
  const navLinks = el("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });
  }

  // ----- Smooth Scrolling for Navigation Links -----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });

        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          const icon = mobileMenuBtn ? mobileMenuBtn.querySelector("i") : null;
          if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
        }
      }
    });
  });

  // ----- Authentication UI Elements -----
  const authModal = el("authModal");
  const signInFormDiv = el("signInForm");
  const registerFormDiv = el("registerForm");
  const showRegisterBtn = el("showRegister");
  const showSignInBtn = el("showSignIn");
  // const signInBtn = document.querySelector(".sign-in");
  // const registerBtn = document.querySelector(".register");
  const authButtonsContainer = document.querySelector(".auth-buttons");

  function openAuthModal() {
    if (authModal) {
      authModal.classList.add("open");
    }
  }
  function closeAuthModal() {
    if (authModal) {
      authModal.classList.remove("open");
    }
  }
  function showRegisterForm() {
    if (signInFormDiv) signInFormDiv.style.display = "none";
    if (registerFormDiv) registerFormDiv.style.display = "block";
  }
  function showSignInForm() {
    if (registerFormDiv) registerFormDiv.style.display = "none";
    if (signInFormDiv) signInFormDiv.style.display = "block";
  }

  // if (signInBtn) signInBtn.addEventListener("click", () => {
  //   showSignInForm();
  //   openAuthModal();
  // });

  // if (registerBtn) registerBtn.addEventListener("click", () => {
  //   showRegisterForm();
  //   openAuthModal();
  // });

  window.addEventListener("click", (e) => {
    if (authModal && e.target === authModal) closeAuthModal();
  });

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showRegisterForm();
    });
  }

  if (showSignInBtn) {
    showSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSignInForm();
    });
  }

  // Accessibility: Trap focus inside modal when open (optional, advanced)
  // (code for this can be added if needed)

  // ----- UI Update based on User Status -----
  function updateUIForUser(user) {
    if (!authButtonsContainer) return;
    authButtonsContainer.innerHTML = "";

    if (user) {
      // Show "Hi, [name]" and "Logout" button
      const greeting = document.createElement("span");
      greeting.textContent = `Hi, ${user.name || user.email}!`;
      greeting.className = "user-greeting";
      greeting.style.marginRight = "12px";
      authButtonsContainer.appendChild(greeting);

      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logoutBtn";
      logoutBtn.textContent = "Logout";
      logoutBtn.className = "logout-btn";
      logoutBtn.style.backgroundColor = "white";
      logoutBtn.style.color = "#007BFF";
      logoutBtn.style.border = "none";
      logoutBtn.style.padding = "0.5rem 1.2rem";
      logoutBtn.style.borderRadius = "4px";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.style.fontWeight = "500";
      logoutBtn.style.marginLeft = "10px";
      authButtonsContainer.appendChild(logoutBtn);

      logoutBtn.addEventListener("click", async () => {
        try {
          await Backendless.UserService.logout();
          alert("Logged out successfully");
          updateUIForUser(null);
        } catch (error) {
          alert("Error during logout: " + (error.message || error));
        }
      });

    } else {
      const signIn = document.createElement("button");
      signIn.className = "sign-in";
      signIn.textContent = "Sign In";
      signIn.style.marginRight = "10px";
      authButtonsContainer.appendChild(signIn);
  
      const register = document.createElement("button");
      register.className = "register";
      register.textContent = "Register";
      authButtonsContainer.appendChild(register);
  
      // *** These lines MUST be inside this 'else' block ***
      signIn.addEventListener('click', () => {
        showSignInForm();
        openAuthModal();
      });
      register.addEventListener('click', () => {
        showRegisterForm();
        openAuthModal();
      });
    }
  }

  // ----- User Session Check (and UI update) -----
  Backendless.UserService.isValidLogin().then((isValid) => {
    if (isValid) {
      Backendless.UserService.getCurrentUser()
        .then((user) => updateUIForUser(user))
        .catch(() => updateUIForUser(null));
    } else {
      updateUIForUser(null);
    }
  });

  // ----- Register Form Submission -----
  const register = el("register");
  if (register) {
    register.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = el("registerName") ? el("registerName").value.trim() : "";
      const email = el("registerEmail") ? el("registerEmail").value.trim() : "";
      const contact = el("registerContact") ? el("registerContact").value.trim() : "";
      const password = el("registerPassword") ? el("registerPassword").value.trim() : "";

      if (!name || !email || !contact || !password) {
        alert("Please fill in all fields!");
        return;
      }
      if (!/^\d{10}$/.test(contact)) {
        alert("Please enter a valid 10-digit contact number!");
        return;
      }

      try {
        const user = new Backendless.User();
        user.email = email;
        user.password = password;
        user.name = name;
        user.contact = contact;

        const registeredUser = await Backendless.UserService.register(user);
        alert(`Registered successfully: ${registeredUser.email}`);

        register.reset();
        showSignInForm();
      } catch (error) {
        alert("Registration failed: " + (error.message || error));
      }
    });
  }

  // ----- Sign-In Form Submission -----
  const signIn = el("signIn");
  if (signIn) {
    signIn.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = el("signInEmail") ? el("signInEmail").value.trim() : "";
      const password = el("signInPassword") ? el("signInPassword").value : "";

      if (!email || !password) {
        alert("Please fill in all fields!");
        return;
      }

      try {
        const loggedInUser = await Backendless.UserService.login(email, password, true);
        alert(`Signed in as: ${loggedInUser.email}`);
        updateUIForUser(loggedInUser);
        closeAuthModal();
      } catch (error) {
        alert("Error signing in: " + (error.message || error));
      }
    });
  }

  // ----- "Book Ride" Button -----
  const bookRideButton = document.querySelector(".book-ride");
  if (bookRideButton) {
    bookRideButton.addEventListener("click", () => {
      const bookingFormSection = el("booking");
      if (bookingFormSection) {
        bookingFormSection.style.display = "block";
        window.scrollTo({
          top: bookingFormSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  }

  // ----- Fetch and Render Vehicles Dynamically -----
  let viewAllBtnListenerSet = false;
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  // --- Filtered Vehicle Loading ---
async function loadVehicles(showAll = false, filterCarType = "") {
  const vehicleContainer = document.getElementById("vehicleContainer");
  const carTypeSelect = document.getElementById("carTypeSelect");
  if (!vehicleContainer || !carTypeSelect) return;

  try {
    const vehicles = await Backendless.Data.of("vehicles").find();

    // Filter by carType if set
    let filteredVehicles = vehicles;
    if (filterCarType) {
      filteredVehicles = vehicles.filter(v =>
        v.carType && v.carType.toLowerCase() === filterCarType.toLowerCase()
      );
    }

    vehicleContainer.innerHTML = "";
    carTypeSelect.innerHTML = '<option value="">Choose car type...</option>';

    // Populate car type dropdown
    const seenCarTypes = new Set();
    vehicles.forEach(vehicle => {
      if (vehicle.carType && !seenCarTypes.has(vehicle.carType.toLowerCase())) {
        const option = document.createElement("option");
        option.value = vehicle.carType.toLowerCase();
        option.textContent = vehicle.carType;
        carTypeSelect.appendChild(option);
        seenCarTypes.add(vehicle.carType.toLowerCase());
      }
    });

    // Choose amount to show (default: 3, or all if filtered/all)
    const vehiclesToShow = showAll ? filteredVehicles : filteredVehicles.slice(0, 3);

    if (!vehiclesToShow.length) {
      vehicleContainer.innerHTML = `<div class="no-vehicles">No vehicles match your criteria.</div>`;
      const viewAllBtn = document.querySelector(".view-all-btn");
      if (viewAllBtn) viewAllBtn.style.display = "none";
      return;
    }

    vehiclesToShow.forEach(vehicle => {
      const card = document.createElement("div");
      card.className = "vehicle-card";

      const imageUrl = vehicle.imageUrl || "placeholder.svg";
      card.innerHTML = `
        <div class="vehicle-image">
          <img src="${imageUrl}" alt="${vehicle.model}">
        </div>
        <div class="vehicle-details">
          <div class="vehicle-info">
            <h3>${vehicle.model}</h3>
            <div class="price">₹${vehicle.price}<span>/day</span></div>
          </div>
          <div class="vehicle-specs">
            <div class="spec"><i class="fas fa-car"></i> ${vehicle.model}</div>
            <div class="spec"><i class="fas fa-gas-pump"></i> ${vehicle.fuelType}</div>
            <div class="spec"><i class="fas fa-cog"></i> ${vehicle.transmission}</div>
          </div>
          <button class="book-now-btn" data-car-type="${vehicle.carType}">Book Now</button>
        </div>
      `;
      vehicleContainer.appendChild(card);

      // Attach Book Now modal handler (see next section)
      const bookBtn = card.querySelector('.book-now-btn');
      if (bookBtn) setBookNowEvent(bookBtn, vehicle);
    });

    // Handle "View All" button visibility
    const viewAllBtn = document.querySelector(".view-all-btn");
    if (viewAllBtn && filteredVehicles.length > 3) {
      viewAllBtn.style.display = showAll ? "none" : "block";
      if (!viewAllBtn._handlerSet) {
        viewAllBtn.addEventListener("click", () => loadVehicles(true, filterCarType));
        viewAllBtn._handlerSet = true;
      }
    } else if (viewAllBtn) {
      viewAllBtn.style.display = "none";
    }

  } catch (error) {
    console.error("Error loading vehicles:", error);
  }
}

// Booking search button filters by carType
const searchBtn = document.querySelector(".search-btn");
if (searchBtn) {
  searchBtn.addEventListener("click", e => {
    e.preventDefault();
    const selectedCarType = document.getElementById("carTypeSelect")?.value || "";
    loadVehicles(true, selectedCarType);
    document.getElementById("vehicles").scrollIntoView({ behavior: "smooth" });
  });
}

// Initial load (shows default top 3, unfitered)
loadVehicles();


// --- Book Now Modal Logic ---

// Reference modal elements
const bookingConfirmModal = document.getElementById('bookingConfirmModal');
const bookingConfirmationDetails = document.getElementById('bookingConfirmationDetails');
const confirmBookingBtn = document.getElementById('confirmBookingBtn');
const cancelBookingBtn = document.getElementById('cancelBookingBtn');

// These will store state between clicks
let pendingBookingVehicle = null;

function openBookingConfirmModal(vehicle) {
  pendingBookingVehicle = vehicle;
  if (!bookingConfirmModal) return;

  // Get user booking form selections for pickup/drop info
  const pickupLocation = document.getElementById("pickupLocation")?.value || "-";
  const dropoffLocation = document.getElementById("dropoffLocation")?.value || "-";
  const pickupDate = document.getElementById("pickupDate")?.value || "-";
  const pickupTime = document.getElementById("pickupTime")?.value || "-";
  const dropoffDate = document.getElementById("dropoffDate")?.value || "-";
  const dropoffTime = document.getElementById("dropoffTime")?.value || "-";

  bookingConfirmationDetails.innerHTML = `
    <p><strong>Car Type:</strong> ${vehicle.carType}</p>
    <p><strong>Model:</strong> ${vehicle.model}</p>
    <p><strong>Price:</strong> ₹${vehicle.price}/day</p>
    <hr>
    <p><strong>Pick-up:</strong> ${pickupLocation}, ${pickupDate} ${pickupTime}</p>
    <p><strong>Drop-off:</strong> ${dropoffLocation}, ${dropoffDate} ${dropoffTime}</p>
    <small>Please confirm your booking details.</small>
  `;
  bookingConfirmModal.classList.add('open');
}

if (cancelBookingBtn) {
  cancelBookingBtn.onclick = () => bookingConfirmModal.classList.remove('open');
}
if (bookingConfirmModal) {
  bookingConfirmModal.onclick = e => {
    if (e.target === bookingConfirmModal) bookingConfirmModal.classList.remove('open');
  };
}

function checkBookingFormFields() {
  let valid = true;
  const requiredFields = [
    "pickupLocation",
    "dropoffLocation",
    "pickupDate",
    "pickupTime",
    "dropoffDate",
    "dropoffTime"
  ];
  requiredFields.forEach(id => {
    const field = document.getElementById(id);
    if (!field || !field.value) {
      valid = false;
      // Optional: highlight empty field
      if (field) {
        field.classList.add('input-error');
        // remove highlight after 1s for UX
        setTimeout(() => field.classList.remove('input-error'), 1200);
      }
    }
  });
  return valid;
}
// Wire up each Book Now button with this handler (to be called for any dynamic card)
// Set Book Now button event for each vehicle card
function setBookNowEvent(btn, vehicle) {
  btn.addEventListener("click", () => {
    if (!checkBookingFormFields()) {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.style.display = "block";
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    openBookingConfirmModal(vehicle);
  });
}

// Booking confirmation logic
if (confirmBookingBtn) {
  confirmBookingBtn.onclick = async function() {
    // Get booking form values again
    const pickupLocation = document.getElementById("pickupLocation")?.value || "";
    const dropoffLocation = document.getElementById("dropoffLocation")?.value || "";
    const pickupDate = document.getElementById("pickupDate")?.value || "";
    const pickupTime = document.getElementById("pickupTime")?.value || "";
    const dropoffDate = document.getElementById("dropoffDate")?.value || "";
    const dropoffTime = document.getElementById("dropoffTime")?.value || "";

    // Basic validation
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      alert("Please fill in all booking form fields before confirming.");
      return;
    }
    const pickupDateTime = new Date(pickupDate + "T" + pickupTime);
    const dropoffDateTime = new Date(dropoffDate + "T" + dropoffTime);
    if (isNaN(pickupDateTime) || isNaN(dropoffDateTime)) {
      alert("Invalid date/time selection.");
      return;
    }
    if (dropoffDateTime <= pickupDateTime) {
      alert("Drop-off must be after pickup.");
      return;
    }

    let currentUser = null;
    try {
      currentUser = await Backendless.UserService.getCurrentUser();
      if (!currentUser) throw new Error("Not logged in");
    } catch {
      alert("Sign in to book a car.");
      return;
    }

    const bookingData = {
      carld: pendingBookingVehicle.carType,
      pickupLocation,
      dropoffLocation,
      pickupDatetime: pickupDateTime.toISOString(),
      dropDatetime: dropoffDateTime.toISOString(),
      custld: currentUser.objectId,
      usermail: currentUser.email,
      contactNumber: currentUser.contact || "",
    };

    try {
      await Backendless.Data.of("bookings").save(bookingData);
      alert("Booking confirmed!");
      bookingConfirmModal.classList.remove('open');
      document.getElementById("carBookingForm")?.reset();
    } catch (err) {
      alert("Booking failed: " + (err.message || err));
    }
  };
}


  // ----- Review Slider Functionality -----
  function setupReviewSlider() {
    const reviews = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.review-dots .dot');
    let currentReviewIndex = 0;

    if (reviews.length === 0 || dots.length === 0) return;

    function showReview(index) {
      reviews.forEach((review, i) => {
        review.classList.toggle('active', i === index);
        if (dots[i]) dots[i].classList.toggle("active", i === index);
      });
    }

    const prevBtn = el("prevReview"), nextBtn = el("nextReview");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
        showReview(currentReviewIndex);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        showReview(currentReviewIndex);
      });
    }
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentReviewIndex = i;
        showReview(currentReviewIndex);
      });
    });

    showReview(currentReviewIndex);

    setInterval(() => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      showReview(currentReviewIndex);
    }, 5000);
  }
  setupReviewSlider();

  // ----- Booking Form Submission with Overlap Validation -----
  const bookingForm = el("carBookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const pickupLocation = el("pickupLocation") ? el("pickupLocation").value : "";
      const dropoffLocation = el("dropoffLocation") ? el("dropoffLocation").value : "";
      const pickupDate = el("pickupDate") ? el("pickupDate").value : "";
      const pickupTime = el("pickupTime") ? el("pickupTime").value : "";
      const dropoffDate = el("dropoffDate") ? el("dropoffDate").value : "";
      const dropoffTime = el("dropoffTime") ? el("dropoffTime").value : "";
      const carType = el("carTypeSelect") ? el("carTypeSelect").value : "";

      if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !carType) {
        alert("Please fill in all required fields");
        return;
      }

      const pickupDateTime = new Date(pickupDate + "T" + pickupTime);
      const dropoffDateTime = new Date(dropoffDate + "T" + dropoffTime);

      if (pickupDateTime < new Date()) {
        alert("Pickup date/time cannot be in the past");
        return;
      }
      if (dropoffDateTime <= pickupDateTime) {
        alert("Drop-off date/time must be after pickup date/time");
        return;
      }

      try {
        const currentUser = await Backendless.UserService.getCurrentUser();

        if (!currentUser) {
          alert("Please sign in before making a booking");
          return;
        }

        // Overlap detection
        const whereClause = `
          custld = '${currentUser.objectId}' AND
          pickupDatetime <= '${dropoffDateTime.toISOString()}' AND
          dropDatetime >= '${pickupDateTime.toISOString()}'
        `;

        const overlappingBookings = await Backendless.Data.of("bookings").find({ whereClause });

        if (overlappingBookings.length > 0) {
          alert("You already have a booking during this period. Please finish or cancel it before making a new booking.");
          return;
        }

        const bookingData = {
          carld: carType,
          pickupLocation,
          dropoffLocation,
          pickupDatetime: pickupDateTime.toISOString(),
          dropDatetime: dropoffDateTime.toISOString(),
          custld: currentUser.objectId,
          usermail: currentUser.email,
          contactNumber: currentUser.contact || "",
        };

        await Backendless.Data.of("bookings").save(bookingData);

        alert("Booking submitted successfully!");
        bookingForm.reset();
      } catch (error) {
        alert("Failed to submit booking: " + (error.message || error));
      }
    });

    // Set minimum dates for booking inputs
    const today = new Date().toISOString().split("T")[0];
    if (el("pickupDate")) el("pickupDate").min = today;
    if (el("dropoffDate")) el("dropoffDate").min = today;

    if (el("pickupDate")) {
      el("pickupDate").addEventListener("change", function () {
        if (el("dropoffDate")) {
          el("dropoffDate").min = this.value;
          if (el("dropoffDate").value < this.value) {
            el("dropoffDate").value = this.value;
          }
        }
      });
    }
  }
});
