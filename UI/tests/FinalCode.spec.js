

const { test, expect } = require('@playwright/test');


//  a function to generate random data
function generateRandomData() {
 const timestamp = Date.now();
 const randomNum = Math.floor(Math.random() * 1000);
  return {
   firstName: `TestUser${randomNum}`,
   lastName: `LastName${timestamp}`,
   email: `test${timestamp}@testmail.com`,
   contactNumber: `98765${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
   npiNumber: `12345${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
   patientEmail: `patient${timestamp}@testmail.com`,
   patientFirstName: `Patient${randomNum}`,
   patientLastName: `PatientLast${timestamp}`
 };
}


test.describe('Ecarehealth End-to-End Flow', () => {
 let page;
 let testData;


 test.beforeEach(async ({ browser }) => {
   // Generate test data
   testData = generateRandomData();
  
   // Launch browser and create new page
   const context = await browser.newContext();
   page = await context.newPage();
  
   // Set viewport size
   await page.setViewportSize({ width: 1920, height: 1080 });
 });


 test('Complete Ecarehealth workflow - Provider, Patient, and Appointment', async () => {
   console.log('Generated test data:', testData);


   // Step 1: Navigate to login page
   console.log('Step 1: Navigating to login page...');
   await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/');
   await page.waitForLoadState('networkidle');


   // Step 2: Login
   console.log('Step 2: Logging in...');
   await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'rose.gomez@jourrapide.com');
   await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', 'Pass@123');
  
   // Click login button (looking for various possible button texts)
   const loginButton = page.locator('button:has-text("Let"), button:has-text("Login"), button:has-text("Sign"), button[type="submit"]').first();
   await loginButton.click();
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(3000);


   // Step 3: Add Provider User
   console.log('Step 3: Adding Provider User...');
  
   // Navigate to Settings
   await page.click('text="Settings"');
   await page.waitForTimeout(2000);
  
   // Click User Settings
   await page.click('text="User Settings"');
   await page.waitForTimeout(2000);
  
   // Click Providers
   await page.click('text="Providers"');
   await page.waitForTimeout(2000);
  
   // Click Add Provider User
   await page.click('text="Add Provider User"');
   await page.waitForTimeout(2000);


   // Fill Provider Details
   console.log('Filling provider details...');
   await page.fill('input[name="firstName"], input[placeholder*="first" i]', testData.firstName);
   await page.fill('input[name="lastName"], input[placeholder*="last" i]', testData.lastName);
  
   // Select Role - Provider
   await page.click('select[name="role"], [data-testid*="role"], text="Role"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Provider"), text="Provider"');
  
   // Select Gender - Male
   await page.click('select[name="gender"], [data-testid*="gender"], text="Gender"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Male"), text="Male"');
  
   // Fill other details
   await page.fill('input[name="contactNumber"], input[placeholder*="contact" i], input[placeholder*="phone" i]', testData.contactNumber);
   await page.fill('input[name="email"], input[placeholder*="email" i]:not([type="password"])', testData.email);
   await page.fill('input[name="npiNumber"], input[placeholder*="npi" i]', testData.npiNumber);
  
   // Save Provider
   await page.click('button:has-text("Save"), [data-testid*="save"]');
   await page.waitForTimeout(3000);
  
   // Validate provider is created
   console.log('Validating provider creation...');
   const providerExists = await page.isVisible(`text="${testData.firstName} ${testData.lastName}"`);
   expect(providerExists).toBeTruthy();
   console.log('✅ Provider created successfully');


   // Step 4: Set Provider Availability
   console.log('Step 4: Setting Provider Availability...');
  
   // Navigate to Scheduling
   await page.click('text="Scheduling", [data-testid*="scheduling"]');
   await page.waitForTimeout(2000);
  
   // Click Availability
   await page.click('text="Availability", [data-testid*="availability"]');
   await page.waitForTimeout(2000);
  
   // Click Edit Availabilitygit 
   await page.click('text="Edit Availability", button:has-text("Edit"), [data-testid*="edit-availability"]');
   await page.waitForTimeout(2000);
  
   // Select Provider
   await page.click('select[name="provider"], [data-testid*="provider"], text="Provider"');
   await page.waitForTimeout(1000);
   await page.click(`option:has-text("${testData.firstName}"), text="${testData.firstName} ${testData.lastName}"`);
  
   // Select Timezone - Indian Standard Time
   await page.click('select[name="timezone"], [data-testid*="timezone"], text="Timezone"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Indian Standard Time"), text="Indian Standard Time"');
  
   // Select Booking Window - 3 Week
   await page.click('select[name="bookingWindow"], [data-testid*="booking"], text="Booking Window"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("3 Week"), text="3 Week"');
  
   // Select Day - Monday
   await page.click('select[name="day"], [data-testid*="day"], text="Day"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Monday"), text="Monday"');
  
   // Set Start Time - 12:00 AM
   await page.click('select[name="startTime"], [data-testid*="start"], input[type="time"]');
   await page.waitForTimeout(1000);
   await page.selectOption('select[name="startTime"]', '00:00');
  
   // Set End Time - 11:45 PM
   await page.click('select[name="endTime"], [data-testid*="end"], input[type="time"]');
   await page.waitForTimeout(1000);
   await page.selectOption('select[name="endTime"]', '23:45');
  
   // Check Telehealth
   await page.check('input[type="checkbox"][name*="telehealth"], input[type="checkbox"]:near(text="Telehealth")');
  
   // Save Availability
   await page.click('button:has-text("Save"), [data-testid*="save"]');
   await page.waitForTimeout(3000);
   console.log('✅ Provider availability set successfully');


   // Step 5: Add New Patient
   console.log('Step 5: Adding New Patient...');
  
   // Click Create -> New Patient
   await page.click('text="Create", [data-testid*="create"], button:has-text("Create")');
   await page.waitForTimeout(1000);
   await page.click('text="New Patient", [data-testid*="new-patient"]');
   await page.waitForTimeout(2000);
  
   // Click Enter Patient Details -> Next
   await page.click('text="Enter Patient Details", button:has-text("Enter"), [data-testid*="patient-details"]');
   await page.waitForTimeout(1000);
   await page.click('text="Next", button:has-text("Next")');
   await page.waitForTimeout(2000);
  
   // Fill Patient Details
   console.log('Filling patient details...');
   await page.fill('input[name="firstName"], input[placeholder*="first" i]', testData.patientFirstName);
   await page.fill('input[name="lastName"], input[placeholder*="last" i]', testData.patientLastName);
   await page.fill('input[name="dob"], input[type="date"], input[placeholder*="date" i]', '1995-01-01');
  
   // Select Gender - Male
   await page.click('select[name="gender"], [data-testid*="gender"]');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Male"), text="Male"');
  
   // Fill Mobile and Email
   await page.fill('input[name="mobile"], input[placeholder*="mobile" i], input[placeholder*="phone" i]', '9876544400');
   await page.fill('input[name="email"], input[placeholder*="email" i]:not([type="password"])', testData.patientEmail);
  
   // Save Patient
   await page.click('button:has-text("Save"), [data-testid*="save"]');
   await page.waitForTimeout(3000);
  
   // Validate patient is created
   console.log('Validating patient creation...');
   const patientExists = await page.isVisible(`text="${testData.patientFirstName} ${testData.patientLastName}"`);
   expect(patientExists).toBeTruthy();
   console.log('✅ Patient created successfully');


   // Step 6: Book New Appointment
   console.log('Step 6: Booking New Appointment...');
  
   // Click Create -> New Appointment
   await page.click('text="Create", [data-testid*="create"], button:has-text("Create")');
   await page.waitForTimeout(1000);
   await page.click('text="New Appointment", [data-testid*="new-appointment"]');
   await page.waitForTimeout(2000);
  
   // Select Patient Name
   await page.click('select[name="patientName"], [data-testid*="patient"], text="Patient Name"');
   await page.waitForTimeout(1000);
   await page.click(`option:has-text("${testData.patientFirstName}"), text="${testData.patientFirstName} ${testData.patientLastName}"`);
  
   // Select Appointment Type - New Patient Visit
   await page.click('select[name="appointmentType"], [data-testid*="appointment-type"], text="Appointment Type"');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("New Patient Visit"), text="New Patient Visit"');
  
   // Enter Reason for Visit
   await page.fill('input[name="reason"], textarea[name="reason"], input[placeholder*="reason" i]', 'Fever');
  
   // Select Timezone - Indian Standard Time
   await page.click('select[name="timezone"], [data-testid*="timezone"]');
   await page.waitForTimeout(1000);
   await page.click('option:has-text("Indian Standard Time")');
  
   // Toggle to Telehealth
   await page.check('input[type="checkbox"][name*="telehealth"], input[type="radio"][value*="telehealth"]');
  
   // Select Provider
   await page.click('select[name="provider"], [data-testid*="provider"]');
   await page.waitForTimeout(1000);
   await page.click(`option:has-text("${testData.firstName}"), text="${testData.firstName} ${testData.lastName}"`);
  
   // View Availability
   await page.click('button:has-text("View Availability"), [data-testid*="view-availability"]');
   await page.waitForTimeout(3000);
  
   // Select first available slot
   const firstSlot = page.locator('[data-testid*="time-slot"], .time-slot, button:has-text("AM"), button:has-text("PM")').first();
   await firstSlot.click();
   await page.waitForTimeout(1000);
  
   // Save and Close
   await page.click('button:has-text("Save and Close"), button:has-text("Save"), [data-testid*="save"]');
   await page.waitForTimeout(3000);
   console.log('✅ Appointment booked successfully');


   // Step 7: Validate Appointment
   console.log('Step 7: Validating Appointment...');
  
   // Navigate to Scheduling -> Appointments
   await page.click('text="Scheduling", [data-testid*="scheduling"]');
   await page.waitForTimeout(2000);
   await page.click('text="Appointments", [data-testid*="appointments"]');
   await page.waitForTimeout(3000);
  
   // Validate appointment exists
   const appointmentExists = await page.isVisible(`text="${testData.patientFirstName} ${testData.patientLastName}"`);
   expect(appointmentExists).toBeTruthy();
   console.log('✅ Appointment validated successfully');


   console.log('🎉 All test steps completed successfully!');
   console.log('Test Summary:');
   console.log(`- Provider: ${testData.firstName} ${testData.lastName} (${testData.email})`);
   console.log(`- Patient: ${testData.patientFirstName} ${testData.patientLastName} (${testData.patientEmail})`);
   console.log('- Appointment: Booked and validated');
 });


 test.afterEach(async () => {
   if (page) {
     await page.close();
   }
 });
});


// Export test data generator for potential reuse
module.exports = {
 generateRandomData
};

