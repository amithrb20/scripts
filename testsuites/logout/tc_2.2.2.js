/*
 Author: Prateek 
 Description: This is a casperjs automated test script for showning that,On clicking the GitHub Logout button present
 *  in "goodbye.R" page, the user gets a notification if he/she wants to log out of GitHub, confirming which, 
 * the user gets logged out from GitHub and Sign-In page of github.com opens
 */

//Begin Tests

casper.test.begin(" Clicking on Log back in link once user log out from the GitHub, user navigates to GitHub login page", 8, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var URL = 'http://127.0.0.1:8080/goodbye.R';

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        var title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //logout of RCloud & Github
    casper.then(function () {
        this.click({type: 'xpath', path: ".//*[@id='rcloud-logout']"});
        console.log('Logging out of RCloud');
        this.wait(3000);
    });

    //verifying whether user has logged out of RCloud or not
    casper.then(function () {
        if (this.test.assertSelectorHasText({
                type: 'xpath',
                path: ".//*[@id='main-div']/p[1]/a"
            }, 'Log back in', 'Log back in option is visible')) {
            this.test.pass('User is logged out of RCloud');
        } else {
            this.test.fail('User is not logged out of RCloud');
        }
    });
    
    casper.then(function(){
		this.click({type:'xpath' , path:".//*[@id='main-div']/p[2]/a[1]"})
		console.log('Clicking on GitHub link');
		this.wait(5000);
	});
	
	casper.then(function(){
		this.echo("The url after clicking on GitHub link : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that user is navigated to GitHub page");
	});
    
    casper.then(function(){
		this.click({type:'xpath', path:".//*[@id='user-links']/li[5]/form/button"});
		this.wait(5000);
	});
	
	//Opening Goodbye.R page
	casper.viewport(1366, 768).then(function () {
		this.thenOpen(URL, function () {
			console.log("opening Goodbye.R page");
			this.wait(5000);
			if(this.test.assertSelectorHasText({type: 'xpath',path: ".//*[@id='main-div']/p[1]/a"}, 'Log back in', 'Log back in option is visible'))
			{
				this.click({type: 'xpath',path: ".//*[@id='main-div']/p[1]/a"});
				console.log("Clicking on 'Log back in' link");
			}else
			{
				console.log('Log back in link is not visible');
			}
		});
	});
	
	//Clicking on Logback in from Goodbye.R page
	casper.then(function(){
		this.test.assertExists({type:'xpath', path:".//*[@id='login']/form/div[3]"});
		this.wait(3000);
		console.log('Sign in form for GitHub exists');
    });
    
    casper.run(function () {
        test.done();
    });
});
