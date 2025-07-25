const { test, expect } = require('@playwright/test');

test('Full Provider Flow: Create Provider → Set Availability → Create Patient → Book Appointment', async ({ page }) => {
  const baseURL = 'https://stage_aithinkitive.uat.provider.ecarehealth.com/';
  const adminEmail = 'rose.gomez@jourrapide.com';
  const adminPassword = 'Pass@123';

  // 🔧 Generate Random Test Data
  const rand = Date.now();
  const provider = {
    firstName: `Prov${rand}`,
    lastName: `User${rand}`,
    email: `provider${rand}@ecaretest.com`,
    dob: `01-01-${1980 + Math.floor(Math.random() * 30)}`,
    gender: 'Male',
    type: 'MD'
  };

  const patient = {
    firstName: `Patient${rand}`,
    lastName: `User${rand}`,
    dob: '01-01-1995',
    gender: 'Female',
    mobile: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
    email: `patient${rand}@mailinator.com`
  };

  const appointment = {
    reason: 'Fever',
    type: 'New Patient Visit',
    visitType: 'Telehealth',
    timeZone: 'Indian Standard Time (UTC +5:30)'
  };

  // ✅ Login
  await page.goto(baseURL);
  await page.fill('input[placeholder="Email"]', adminEmail);
  await page.fill('input[type="password"]', adminPassword);
  await page.click('button:has-text("Let\'s get Started")');
  await page.waitForURL('**/app/provider/**');

  // ✅ Navigate to Settings → User Settings → Providers
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();

  // ✅ Add Provider
  await page.getByRole('button', { name: 'Add Provider User' }).click();
  await page.fill('input[placeholder*="First Name"]', provider.firstName);
  await page.fill('input[placeholder*="Last Name"]', provider.lastName);
  await page.locator('form').filter({ hasText: 'Provider Type' }).getByLabel('Open').click();
  await page.getByRole('option', { name: provider.type }).click();
  await page.locator('form').filter({ hasText: 'Role *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.fill('input[placeholder*="DOB"]', provider.dob);
  await page.locator('form').filter({ hasText: 'Gender *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: provider.gender }).click();
  await page.fill('input[placeholder*="Email"]', provider.email);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('text=Provider created successfully')).toBeVisible();

  // ✅ Navigate to Scheduling → Availability
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByRole('menuitem', { name: 'Availability' }).click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();
  await page.locator('form').filter({ hasText: 'Select Provider' }).getByLabel('Open').click();
  await page.getByRole('option', { name: `${provider.firstName} ${provider.lastName}` }).click();
  await page.locator('form').filter({ hasText: 'Booking Window' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '10:00 PM' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator(`text=Availability added successfully`)).toBeVisible();

  // ✅ Create Patient
  await page.click('text=Create');
  await page.click('text=New Patient');
  await page.click('text=Enter Patient Details');
  await page.click('text=Next');
  await page.fill('input[placeholder*="First Name"]', patient.firstName);
  await page.fill('input[placeholder*="Last Name"]', patient.lastName);
  await page.fill('input[placeholder*="Date of Birth"]', patient.dob);
  await page.selectOption('select[name="gender"]', patient.gender);
  await page.fill('input[placeholder*="Mobile"]', patient.mobile);
  await page.fill('input[placeholder*="Email"]', patient.email);
  await page.click('button:has-text("Save")');
  await expect(page.locator(`text=${patient.firstName}`)).toBeVisible();

  // ✅ Book Appointment
  await page.click('text=Create');
  await page.click('text=New appointment');
  await page.selectOption('select[name="patientName"]', { label: `${patient.firstName} ${patient.lastName}` });
  await page.selectOption('select[name="appointmentType"]', { label: appointment.type });
  await page.fill('input[name="reasonForVisit"]', appointment.reason);
  await page.selectOption('select[name="timeZone"]', { label: appointment.timeZone });
  await page.click('input[value="Telehealth"]'); // Toggle Visit Type
  await page.selectOption('select[name="provider"]', { label: `${provider.firstName} ${provider.lastName}` });
  await page.click('button:has-text("View Availability")');
  await page.locator('.available-slot').first().click(); // May need to adjust selector
  await page.click('button:has-text("Save and close")');

  // ✅ Verify Appointment in Appointments Tab
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.click('text=Appointments');
  await expect(page.locator(`text=${patient.firstName}`)).toBeVisible();

  console.log(`✅ Flow completed: ${provider.firstName} created and appointment booked for ${patient.firstName}`);
});
