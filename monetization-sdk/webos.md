---
title: "webOS"
description: "Integrate Massive SDK into your webOS TV application with this guide."
icon: "tv"
iconType: "solid"
---

## Technical Requirements

|                        |                      |
| ---------------------- | -------------------- |
| webOS Version          | `5.0` or later       |
| webOS SDK              | Latest version       |

## Integration Guide

### Sample application

Massive SDK comes with a sample application showing project configuration, API integration, and consent screen.

To run the app, follow these steps:

1. Install the [webOS Simulator](https://webostv.developer.lge.com/develop/tools/simulator-installation).
2. Extract the sample app and the SDK package provided by Massive.
3. Copy `MassiveClient.js` from the SDK to the sample app's `js/` directory.
4. Copy the API token from your [Profile](https://partners.joinmassive.com/profile).
5. Set the token value to the `API_TOKEN` constant in `js/apphelpers.js`.
6. Launch the webOS Simulator and load both the sample app and Massive service directories.
7. Use the app buttons to initialize, start, and stop the SDK.

### Dependency configuration

To integrate the Massive SDK into your webOS project:

1. **Add the SDK client file**
   Copy the `MassiveClient.js` file from the extracted SDK folder into the `js/` directory of your project.

2. **Import the client file**
   Add the following line to your `index.html` file:

   ```html
   <script src="js/MassiveClient.js" charset="utf-8"></script>
   ```

3. **Configure the app domain**
   Replace `com.joinmassive.sampleapp.massivesdk` with your app's domain in all Massive SDK files. 
   
   **Important:** Keep the `.massivesdk` suffix at the end.

   Update this string in the following files:
   - `MassiveClient.js`
   - `package.json`
   - `services.json`
   - `MassiveService.js`

### Integration to the app

#### 1. Get the API token

Massive SDK API token is available in your [Profile](https://partners.joinmassive.com/profile).

#### 2. Initialize MassiveClient

Initialize the client with your API token and handle the result in the callback:

```javascript
window.MassiveClient.init(API_TOKEN, function(result) {
  if (result) {
    // The SDK is initialized
  } else {
    // The SDK initialization failed
  }
});
```

#### 3. Request consent from the user

Before starting the client, obtain user consent for the terms of resource exchange. Please see our [launch checklist](https://www.joinmassive.com/launch-checklist-webos) for additional details.

Example consent text:

```
To remove ads and get free content, please let Massive use a small amount of your device's free resources and IP
address to download public web data from the internet.

This supports the development of Application and helps us to improve our services.

No personal information is collected except your IP address.

Your participation is optional, and you may opt out anytime by accessing Settings (see Massive's FAQ for details).

Pressing Accept indicates that you agree to Massive's license and privacy policy.
```

#### 4. Start usage after consent

After receiving the user's consent, start usage using the `start()` method:

```javascript
// Check if there is user consent to use Massive
if (isUserConsentGiven()) {
    window.MassiveClient.start();
}
```

#### 5. Stop usage

To stop the SDK usage:

```javascript
window.MassiveClient.stop();
```

## Technical details

1. **Service architecture**
   The Massive SDK for webOS uses a JavaScript service (JS Service) architecture that runs as a separate service component. This service handles the core operations independently of the main application, providing better performance and stability.

2. **Luna Service Bus**
   The SDK utilizes webOS's Luna Service Bus for communication between your application and the Massive service. This ensures secure and efficient inter-process communication within the webOS environment.

3. **One-time initialization**
   The SDK should be initialized only once per application session. The initialization establishes communication with the service and prepares the SDK for operation. Subsequent calls to `init` will return the current state without reinitializing.

4. **User consent before starting usage**
   Before starting the SDK usage for the first time (using the `start()` method), it is mandatory to obtain user consent for the terms of resource exchange. This aligns with user privacy and control principles. Ensure that your application includes a clear and understandable consent mechanism.

   ```javascript
   if (isUserConsentGiven) {
       window.MassiveClient.start();
   }
   ```

5. **Starting and stopping the client**
   Initialization of the `MassiveClient` with the `init()` method does not automatically start the usage.
   
   **It prepares the SDK for use but does not begin its operation.**
   
   To ensure that Massive is running, the `start()` method must be called after initialization. The `start()` method is designed to be idempotent, meaning it is safe to call multiple times. If the service is already started, subsequent calls will have no effect.

   The `stop()` method is used to stop the service operation. After calling `stop()`, you can restart the client by calling the `start()` method again.

6. **Persistent service with auto-start**
   The Massive service is designed to persist across application sessions. Once initialized and started, it will continue to operate even when the main application is closed, subject to system resource management policies.

7. **App domain configuration**
   Proper app domain configuration is crucial for the SDK to function correctly. The domain must be consistent across all SDK files and must end with `.massivesdk`. This ensures proper service registration and communication between components.

   Example: If your app domain is `com.mycompany.myapp`, the Massive service domain should be `com.mycompany.myapp.massivesdk`.

8. **Service packaging**
   When packaging your webOS application, ensure that both the client JavaScript file and the service components are properly included. The service must be registered in the application manifest for proper operation.

9. **Error handling**
   The SDK provides error handling through callbacks. Always implement proper error handling to ensure a smooth user experience:

   ```javascript
   window.MassiveClient.init(API_TOKEN, function(result) {
     if (result) {
       // Success handling
       console.log("Massive SDK initialized successfully");
     } else {
       // Error handling
       console.error("Failed to initialize Massive SDK");
     }
   });
   ```

10. **Global scope access**
    The MassiveClient is attached to the window object for global access throughout your application. This design ensures easy integration with various JavaScript frameworks and patterns commonly used in webOS TV applications.

11. **Resource management**
    The SDK is designed to operate efficiently within the resource constraints of webOS TV devices. It manages network and computational resources carefully to avoid impacting the user experience of your application or the overall TV performance.