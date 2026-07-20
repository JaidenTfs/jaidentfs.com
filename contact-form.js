/* ============================================================
   contact-form.js
   ------------------------------------------------------------
   Submits the contact form to Formspree via fetch() so the
   page never navigates away and the person gets a real
   success/error message instead of a mailto popup.
   Only runs on the contact page (safely does nothing if the
   form isn't on the page).
   ============================================================ */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("contact-submit");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.textContent = "";
    statusEl.className = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        statusEl.textContent = "Thanks! Your message is on its way -- I'll get back to you soon.";
        statusEl.className = "form-status-success";
        contactForm.reset();
      } else {
        const data = await response.json().catch(() => null);
        const errorMessage =
          data && data.errors && data.errors.length
            ? data.errors.map((err) => err.message).join(", ")
            : "Something went wrong -- try again, or DM me on Discord/Instagram instead.";
        statusEl.textContent = errorMessage;
        statusEl.className = "form-status-error";
      }
    } catch (err) {
      statusEl.textContent = "Couldn't send that -- check your connection, or DM me on Discord/Instagram instead.";
      statusEl.className = "form-status-error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send";
    }
  });
}
