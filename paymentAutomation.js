const { Builder, Browser, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--no-sandbox");
// options.addArguments("--headless");  // comment for local
options.addArguments("--disable-features=VizDisplayCompositor");
options.addArguments("enable-automation");
options.addArguments("--window-size=1920,1080");
options.addArguments("--disable-gpu");
options.addArguments("--disable-extensions");
options.addArguments("--dns-prefetch-disable");
options.addArguments("enable-features=NetworkServiceInProcess");
options.addArguments("--use-fake-device-for-media-stream");
options.addArguments("--use-fake-ui-for-media-stream");
options.addArguments('--start-fullscreen')
options.addArguments('--force-device-scale-factor=0.75');
options.addArguments('--high-dpi-support=1');
// Initialize WebDriver
const driver = new Builder()
.forBrowser(Browser.CHROME)
.setChromeOptions(options)
.build();

(async function automatePaymentFlow() {
    try {
        // Open Amazon
        await driver.get('https://www.amazon.in');


        // explict wait 
        await new Promise(resolve => setTimeout(resolve, 2500));


        // validate if user is logged in first by checking the availablity of Hello, Bharath
        await driver.executeScript(() => {
            return document.querySelector(`[data-nav-role="signin"]`)?.click()
        })

        await new Promise(resolve => setTimeout(resolve, 2500));

        let emailOrPhone = await driver.wait(until.elementLocated(By.name('email')))
        await driver.wait(until.elementIsVisible(emailOrPhone))
        await emailOrPhone.sendKeys('9741292994')
        await emailOrPhone.sendKeys(Key.ENTER)

        let password = await driver.wait(until.elementLocated(By.name('password')))
        await driver.wait(until.elementIsVisible(password))
        await password.sendKeys('9741292994@Juspay')
        await password.sendKeys(Key.ENTER)


        // wait until search field is visible and check if my name is visible after logged In

        await driver.wait(until.elementLocated(By.xpath(`//*[text()="Hello, Bharath"]`)))
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Step 1: Navigate to the product page and add an item to the cart
        let searchBox = await driver.wait(until.elementLocated(By.id('twotabsearchtextbox')))
        await driver.wait(until.elementIsVisible(searchBox))
        await searchBox.sendKeys('Tissue')
        await new Promise(resolve => setTimeout(resolve, 2500));

        let searchBoxSubmitButton = await driver.wait(until.elementLocated(By.id('nav-search-submit-button')))
        await driver.wait(until.elementIsVisible(searchBox))
        await searchBoxSubmitButton.click()


        let imageInCard = await driver.wait(until.elementLocated(By.css('.s-image')))
        await driver.wait(until.elementIsVisible(imageInCard))

        let imageInCardSrc = imageInCard.getAttribute('src');
        assert.notEqual(imageInCardSrc, '')
        await new Promise(resolve => setTimeout(resolve, 2500));


        let firstProduct = await driver.wait(until.elementLocated(By.xpath(`//*[text()='Add to cart']`)))
        await driver.wait(until.elementIsVisible(firstProduct))
        await firstProduct.click()

        await new Promise(resolve => setTimeout(resolve, 2500));

        // Step 3: Go to Cart
        await driver.wait(until.elementLocated(By.id('nav-cart')), 10000);
        await driver.findElement(By.id('nav-cart')).click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 4: Proceed to Checkout
        await driver.wait(until.elementLocated(By.css('[data-feature-id="proceed-to-checkout-action"]')), 10000);
        await driver.findElement(By.css('[data-feature-id="proceed-to-checkout-action"]')).click();

        await new Promise(resolve => setTimeout(resolve, 2500));

        let customerName = await driver.wait(until.elementLocated(By.css(`[id="deliver-to-customer-text"]`)))
        await driver.wait(until.elementIsVisible(customerName))
        let customerNameValue = await customerName.getText()
        assert.ok(customerNameValue.includes('Delivering to Bharath'))
        await new Promise(resolve => setTimeout(resolve, 2500));


        let customerDeliveryAddress = await driver.wait(until.elementLocated(By.css(`[id="deliver-to-customer-text"]`)))
        await driver.wait(until.elementIsVisible(customerDeliveryAddress))
        let customerDeliveryAddressValue = await customerDeliveryAddress.getText()
        assert.notEqual(customerDeliveryAddressValue, '')
        await new Promise(resolve => setTimeout(resolve, 2500));

        await driver.wait(until.elementLocated(By.xpath(`//*[text()='Credit or debit card']`))).click()
        await driver.wait(until.elementLocated(By.xpath(`//*[text()='Enter card details']`))).click()
        
        await new Promise(resolve => setTimeout(resolve, 4500));

        let iframe = await driver.wait(until.elementLocated(By.css('[name="ApxSecureIframe"]')), 5000);
        await driver.switchTo().frame(iframe);

        let addCardNumber = await driver.wait(until.elementLocated(By.css('[name="addCreditCardNumber"]')), 5000)

        console.log('add card number', addCardNumber)
        await addCardNumber.sendKeys('6082159853000042')
        await new Promise(resolve => setTimeout(resolve, 2500));

        // selecting the click operation for expiry date
        let expiryDateMonth = await driver.wait(until.elementLocated(By.css('.pmts-expiry-month')))
        await expiryDateMonth.click()
        await new Promise(resolve => setTimeout(resolve, 2500));

        await driver.wait(until.elementLocated(By.xpath(`//a[text()='04']`))).click()

        await new Promise(resolve => setTimeout(resolve, 2500));

        let expiryDateYear = await driver.wait(until.elementLocated(By.css('.pmts-expiry-year')))
        await expiryDateYear.click()
        await new Promise(resolve => setTimeout(resolve, 2500));

        await driver.wait(until.elementLocated(By.xpath(`//*[text()='2026']`))).click()
        
        
        await driver.wait(until.elementLocated(By.css(`[name="ppw-widgetEvent:AddCreditCardEvent"]`))).click()
        await new Promise(resolve => setTimeout(resolve, 2500));

        await driver.switchTo().defaultContent();

        let iframeOfCVV = await driver.wait(until.elementLocated(By.css('[name="apx-secure-field-addCreditCardVerificationNumber"]')), 5000);
        await driver.switchTo().frame(iframeOfCVV);


        let cvvBox = await driver.wait(until.elementLocated(By.css('.card-cvv')))
        await driver.wait(until.elementIsVisible(cvvBox))
        await cvvBox.sendKeys('022')
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        await driver.switchTo().defaultContent();
        let paymentSelect = await driver.wait(until.elementLocated(By.css('[data-csa-c-slot-id="checkout-primary-continue-payselect"]')))
        await driver.wait(until.elementIsVisible(paymentSelect))
        await paymentSelect.click()
        await new Promise(resolve => setTimeout(resolve, 3500));

        await driver.switchTo().defaultContent();

        await driver.wait(until.elementLocated(By.css(`.a-popover-wrapper .a-button-input`))).click()

        await new Promise(resolve => setTimeout(resolve, 15000));

        // in case the popup appears
        await driver.executeScript(() => {
            let elem = document.querySelector(`#prime-interstitial-nothanks-button`)
            if(elem){
                elem.click()
            }
            return
        })
        await new Promise(resolve => setTimeout(resolve, 3500));

        let element = await driver.wait(until.elementLocated(By.xpath(`//*[text()='Pay Now']`)))


        await new Promise(resolve => setTimeout(resolve, 3500));

        try{
            await driver.executeScript(() => {
                let elem = document.querySelector(`[name="placeYourOrder1"]`)
                if(elem){
                    elem.click()
                }
                return
            })
        }catch(err){
            console.log('err', err)
        }

        await new Promise(resolve => setTimeout(resolve, 3500));

        // wait for some time if it does not navigate to the authentication screen then it must have given an warning are your sure want to continue, so click on pay again.
        try{
            await driver.executeScript(() => {
                let elem = document.querySelector(`[name="placeYourOrder1"]`)
                if(elem){
                    elem.click()
                }       
                return     
            })
        }catch(err){
            console.log('err', err)
        }
        await driver.wait(until.elementLocated(By.css(`#btnregn`)), 20000)

        console.log('Automation flow reaches OTP page.');
        // cancel order which was placed

        await driver.get(`https://www.amazon.in/gp/css/order-history?ref_=nav_orders_first`)
        await new Promise(resolve => setTimeout(resolve, 3500));


        let viewOrEdit = await driver.wait(until.elementLocated(By.id(`View-or-edit-order_2`)), 5000)
        viewOrEdit.click()

        await new Promise(resolve => setTimeout(resolve, 500));

        await driver.wait(until.elementLocated(By.id(`Cancel-items_1`))).click()

        await new Promise(resolve => setTimeout(resolve, 500));

        await driver.wait(until.elementLocated(By.xpath(`//*[text()="Are you sure you want to cancel this order?"]`)))

        
        await driver.wait(until.elementLocated(By.id(`cancelButton`))).click()
        await new Promise(resolve => setTimeout(resolve, 3500));

        await driver.wait(until.elementLocated(By.xpath(`//*[text()="This order has been cancelled."]`)))
     } catch (error) {
        console.error(error);
    } finally {
        await driver.quit();
    }
})();
