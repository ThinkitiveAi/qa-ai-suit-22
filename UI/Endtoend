// Combined Playwright script for full provider workflow with random data generation

const { test, expect } = require('@playwright/test');

// Helper functions for generating random data
function generateRandomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateRandomDOB() {
  const year = 1970 + Math.floor(Math.random() * 30);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${month}-${day}-${year}`;
}

test('Full Provider Workflow - Create Provider, Set Availability, Book Appointment', async ({ page }) => {
  const randomId = Math.floor(Math.random() * 10000);
  const providerData = {
    firstName: `Prov${generateRandomString()}`,
    lastName: `User${randomId}`,
    email: `prov_${randomId}@testmail.com`,
    dob: generateRandomDOB(),
    gender: 'Male',
    providerType: 'MD'
  };

  const patientData = {
    firstName: `Pat${generateRandomString()}`,
    lastName: `Smith${randomId}`,
    dob: '01-01-1990',
    gender: 'Female',
    mobile: '9876543210',
    email: `patient_${randomId}@testmail.com`
  };

  // Login
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Pass@123');
  await page.getByRole('button', { name: "Let's get Started" }).click();
  await page.waitForURL('**/app/provider/**');

  // Create Provider
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  await page.getByRole('button', { name: 'Add Provider User' }).click();
  await page.getByLabel('First Name *').fill(providerData.firstName);
  await page.getByLabel('Last Name *').fill(providerData.lastName);
  await page.getByLabel('Provider Type *').click();
  await page.getByRole('option', { name: providerData.providerType }).click();
  await page.getByLabel('User Role *').click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.getByLabel('DOB').fill(providerData.dob);
  await page.getByLabel('Gender *').click();
  await page.getByRole('option', { name: providerData.gender }).click();
  await page.getByLabel('Email *').fill(providerData.email);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('text=Provider created successfully')).toBeVisible();

  // Set Availability
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByRole('menuitem', { name: 'Availability' }).click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();
  await page.getByLabel('Select Provider').click();
  await page.getByRole('option', { name: `${providerData.firstName} ${providerData.lastName}` }).click();
  await page.getByLabel('Booking Window').click();
  await page.getByRole('option', { name: '1 Week' }).click();
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.getByLabel('Start Time').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.getByLabel('End Time').click();
  await page.getByRole('option', { name: '10:00 PM' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator(`text=Availability added successfully for provider ${providerData.firstName}`)).toBeVisible();

  // Create Patient
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('menuitem', { name: 'New Patient' }).click();
  await page.getByLabel('First Name').fill(patientData.firstName);
  await page.getByLabel('Last Name').fill(patientData.lastName);
  await page.getByLabel('Date of Birth').fill(patientData.dob);
  await page.getByLabel('Gender').click();
  await page.getByRole('option', { name: patientData.gender }).click();
  await page.getByLabel('Mobile Number').fill(patientData.mobile);
  await page.getByLabel('Email').fill(patientData.email);
  await page.getByRole('button', { name: 'Save' }).click();

  // Book Appointment
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('menuitem', { name: 'New Appointment' }).click();
  await page.getByLabel('Select Patient').click();
  await page.getByRole('option', { name: `${patientData.firstName} ${patientData.lastName}` }).click();
  await page.getByLabel('Appointment Type').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByLabel('Reason for Visit').fill('Routine Checkup');
  await page.getByLabel('Time Zone').click();
  await page.getByRole('option', { name: 'Indian Standard Time (UTC +05:30)' }).click();
  await page.getByLabel('Telehealth').check();
  await page.getByLabel('Provider').click();
  await page.getByRole('option', { name: `${providerData.firstName} ${providerData.lastName}` }).click();
  await page.getByRole('button', { name: 'View Availability' }).click();
  await page.waitForSelector('.available-slot');
  await page.locator('.available-slot').first().click();
  await page.getByRole('button', { name: 'Save and close' }).click();

  // Verify Appointment
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByRole('tab', { name: 'Appointments' }).click();
  await expect(page.locator(`text=${patientData.firstName} ${patientData.lastName}`)).toBeVisible();

  console.log('✅ Full provider workflow completed successfully.');
});
