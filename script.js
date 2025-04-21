document.addEventListener('DOMContentLoaded', function() {

    // --- Initialization & Basic Settings ---

    // Privacy Opt Out/In
    document.getElementById('btnOptOut').addEventListener('click', () => {
        clevertap.privacy.push({ optOut: true });
        console.log("Privacy: Opted Out Data Collection");
        alert("Privacy: Opted Out Data Collection");
    });

    document.getElementById('btnOptIn').addEventListener('click', () => {
        clevertap.privacy.push({ optOut: false });
        console.log("Privacy: Opted In Data Collection");
        alert("Privacy: Opted In Data Collection");
    });

    // Privacy Use IP
    document.getElementById('btnUseIP').addEventListener('click', () => {
        clevertap.privacy.push({ useIP: true });
        console.log("Privacy: Allowed IP for Location");
        alert("Privacy: Allowed IP for Location");
    });

    document.getElementById('btnNoIP').addEventListener('click', () => {
        clevertap.privacy.push({ useIP: false });
        console.log("Privacy: Disallowed IP for Location");
        alert("Privacy: Disallowed IP for Location");
    });

    // Log Level
    document.getElementById('btnSetLogLevel').addEventListener('click', () => {
        const level = parseInt(document.getElementById('logLevel').value, 10);
        clevertap.setLogLevel(level);
        console.log(`Log level set to: ${level}`);
        alert(`Log level set to: ${level}`);
    });

    // Get SDK Version
    document.getElementById('btnGetSDKVersion').addEventListener('click', () => {
        const version = clevertap.getSDKVersion();
        console.log(`CleverTap SDK Version: ${version}`);
        alert(`CleverTap SDK Version: ${version}`);
    });

     // Offline Mode
    document.getElementById('btnOfflineMode').addEventListener('click', () => {
        clevertap.setOffline(true);
        console.log("Offline mode ENABLED. Events will be queued.");
        alert("Offline mode ENABLED. Events will be queued.");
    });

    document.getElementById('btnOnlineMode').addEventListener('click', () => {
        clevertap.setOffline(false);
        console.log("Offline mode DISABLED. Queued events will be sent.");
        alert("Offline mode DISABLED. Queued events will be sent.");
    });


    // --- User Profile Management ---

    // onUserLogin
    document.getElementById('btnLogin').addEventListener('click', () => {
        const identity = document.getElementById('identity').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value; // Make sure it includes country code e.g., +1...

        if (!identity && !email && !phone) {
             alert("Please provide at least one identifier (Identity, Email, or Phone) for onUserLogin.");
             return;
        }

        const profileData = {
            "Site": {
                // Provide at least one of Identity, Email or Phone
                "Identity": identity,
                "Email": email,
                "Phone": phone,

                // Other standard properties (optional)
                "Name": name,
                "Gender": "M", // Example: Can be M or F
                "DOB": new Date(), // Example: Use actual Date object
                "MSG-email": false, // Example preference
                "MSG-push": true,  // Example preference
                "MSG-sms": true,   // Example preference
                "MSG-whatsapp": true // Example preference
            }
        };

        clevertap.onUserLogin.push(profileData);
        console.log("Pushed onUserLogin:", profileData);
        alert("Pushed onUserLogin. Check console for details.");
    });

    // profile.push
    document.getElementById('btnUpdateProfile').addEventListener('click', () => {
        const customerType = document.getElementById('customerType').value;
        const language = document.getElementById('language').value;

        const profileUpdateData = {
            "Site": {
                "Customer Type": customerType,
                "Preferred Language": language
                // Add any other custom profile properties here
            }
        };

        clevertap.profile.push(profileUpdateData);
        console.log("Pushed profile.push:", profileUpdateData);
        alert("Pushed profile.push. Check console for details.");
    });

    // --- Event Tracking ---

    // Simple Event
    document.getElementById('btnSimpleEvent').addEventListener('click', () => {
        const eventName = 'Page Viewed';
        clevertap.event.push(eventName);
        console.log(`Pushed Simple Event: ${eventName}`);
        alert(`Pushed Simple Event: ${eventName}`);
    });

    // Event with Properties
    document.getElementById('btnEventWithProps').addEventListener('click', () => {
        const eventName = 'Product Purchased';
        const prodName = document.getElementById('prodName').value;
        const prodCategory = document.getElementById('prodCategory').value;
        const prodPrice = parseFloat(document.getElementById('prodPrice').value);

        const eventData = {
            "Product Name": prodName,
            "Category": prodCategory,
            "Price": prodPrice,
            "Purchase Date": new Date() // Track date of purchase
        };

        clevertap.event.push(eventName, eventData);
        console.log(`Pushed Event: ${eventName}`, eventData);
        alert(`Pushed Event: ${eventName}. Check console for details.`);
    });


    // --- Web Push Notifications ---
    document.getElementById('btnRequestPush').addEventListener('click', () => {
        // Prompt user for push notification permission
        // The Service Worker registration happens automatically if clevertap_sw.js is at the root
        clevertap.notifications.push({
                "titleText": "Get updates from Us!", // Optional Title
                "bodyText": "Allow notifications to receive latest news and offers.", // Optional Body
                "okButtonText": "Allow", // Optional OK button text
                "rejectButtonText": "Later", // Optional Reject button text
                "okButtonColor": "#ff6900", // Optional button color (hex code)
                // "askAgainTimeInSeconds": 5, // Optional: Re-prompt after 5 seconds if dismissed
                "serviceWorkerPath": "/clevertap_sw.js" // Optional: Specify if not at root
        });
        console.log("Web Push: Permission requested.");
        alert("Web Push: Permission requested (if not already granted/blocked).");
    });


    // --- Web Inbox ---
    // Basic initialization is handled by the main script.
    // Interaction (opening/closing) is often tied to the element ID set in the dashboard.
    // You can manually trigger inbox functions if needed:
    // clevertap.renderInbox() - Call this if you manage the trigger manually and CleverTap doesn't auto-attach to the element ID.
    // Example: If you use 'webInboxTrigger' as the Element ID in CleverTap settings, CleverTap SDK usually handles the click.
    // If not, you could add:
    // document.getElementById('webInboxTrigger').addEventListener('click', () => { clevertap.renderInbox(); });

    console.log("Web Inbox initialized. Awaiting campaigns or trigger element interaction.");


    // --- Native Display ---
    // CleverTap automatically listens for Native Display campaigns.
    // For Key-Value Pair templates, you need to listen for the event.
    document.addEventListener(clevertap.CleverTapEvent[clevertap.CleverTapEvent.WEBNATIVE_DISPLAY], function(e) {
        console.log("Web Native Display Data Received (KV Pair/JSON):", e.detail);
        alert("Received Native Display KV Pair data. Check console!");
        // --- Custom Rendering Logic for Key-Value Pairs ---
        // Example: Find the 'topic' to decide where/how to render
        const data = e.detail; // This is the JSON payload from your campaign
        const topic = data.topic || 'default'; // Get the topic you set in the campaign

        if (topic === 'homepage-banner-kv') { // Example topic name
            const placeholder = document.getElementById('native-display-kv');
            if(placeholder) {
                placeholder.innerHTML = `
                    <h3>${data.title || 'Special Offer!'}</h3>
                    <p>${data.message || 'Check out our latest deals.'}</p>
                    <a href="${data.ctaUrl || '#'}" target="_blank">${data.ctaText || 'Learn More'}</a>
                `;
                 // IMPORTANT: Raise Notification Viewed event
                 clevertap.renderNotificationViewed(data); // Pass the received data object
            }
        }
        // Add more 'if' or 'switch' cases for other topics you define

        // --- IMPORTANT: Tracking Clicks for Custom Rendered KV Pairs ---
        // If you render KV pairs yourself, you MUST track clicks manually.
        const renderedElement = document.getElementById('native-display-kv'); // Or the specific element you updated
        if (renderedElement) {
            renderedElement.querySelectorAll('a, button').forEach(clickable => {
                // Remove previous listener to prevent duplicates if campaign re-triggers
                clickable.removeEventListener('click', handleNativeDisplayClick);
                // Add new listener
                clickable.addEventListener('click', (event) => handleNativeDisplayClick(event, data));
            });
        }
    });

    function handleNativeDisplayClick(event, campaignData) {
         console.log('Native Display (KV) element clicked:', campaignData);
         // Raise Notification Clicked event
         clevertap.renderNotificationClicked(campaignData); // Pass the received data object
         // Allow default link behavior (if it's an 'a' tag)
         // event.preventDefault(); // Use this ONLY if you want to handle the redirect/action purely in JS
    }

    // For Banner/Carousel templates where CleverTap handles rendering:
    // CleverTap automatically injects content into the Div specified by its ID in the campaign setup (e.g., 'native-display-banner').
    // CleverTap SDK automatically handles view and click tracking for these templates.
    console.log("Native Display listener ready. Awaiting campaigns.");


}); // End DOMContentLoaded