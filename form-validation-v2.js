$(document).ready(async function () {
  let invalidDomains = new Set();

  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/jarek-miscreants/Validation/main/invalid-domains.json'
    );
    const domains = await response.json();
    invalidDomains = new Set(domains);
  } catch (e) {
    console.error('Failed to load domain blocklist:', e);
  }

  // Disable submit buttons until blocklist is loaded
  const submitButtons = $('[data-form="validate"] button[type="submit"]');
  if (invalidDomains.size > 0) {
    submitButtons.prop('disabled', false);
  }

  function isValidEmail(email) {
    email = (email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    const domain = email.split('@')[1];
    return !invalidDomains.has(domain);
  }

  function getEmailDomain(email) {
    const trimmed = (email || '').trim().toLowerCase();
    const parts = trimmed.split('@');
    return parts.length === 2 ? parts[1] : null;
  }

  // Handle all email inputs with data-validate="work-email"
  $('[data-validate="work-email"]').each(function () {
    $(this).on('input', function () {
      const email = $(this).val().trim().toLowerCase();
      const errorElement = $(this).siblings('[data-validate="error"]');
      $(this).removeAttr('data-invalid');
      errorElement.hide();

      if (email && !isValidEmail(email)) {
        $(this).attr('data-invalid', '');
        const domain = getEmailDomain(email);
        const errorMessage = domain && invalidDomains.has(domain)
          ? 'This email domain is not accepted'
          : 'Please enter a valid email address';
        errorElement.text(errorMessage).show();
      }
    });
  });

  // Handle form submissions
  $('[data-form="validate"]').each(function () {
    $(this).on('submit', function (e) {
      const emailInput = $(this).find('[data-validate="work-email"]');
      const email = emailInput.val().trim().toLowerCase();

      if (!isValidEmail(email)) {
        e.preventDefault();
        return false;
      }
    });
  });
});
