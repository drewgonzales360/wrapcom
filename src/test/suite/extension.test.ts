import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as comments from '../../comments';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Sample test', () => {
		const actual = comments.wrapCommentText(
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Quis lectus nulla at volutpat. Dignissim sodales ut eu sem integer vitae justo eget magna. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat. Nisi porta lorem mollis aliquam ut porttitor leo a. Nam at lectus urna duis convallis. Aliquet porttitor lacus luctus accumsan tortor posuere. Est placerat in egestas erat imperdiet sed euismod nisi. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Nisi porta lorem mollis aliquam ut porttitor leo a. In mollis nunc sed id semper risus in hendrerit gravida.",
			"    //",
			100
		)

		const expected = `    // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    // labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam. Tellus
    // pellentesque eu tincidunt tortor aliquam nulla facilisi. Quis lectus nulla at volutpat. Dignissim
    // sodales ut eu sem integer vitae justo eget magna. Ut enim blandit volutpat maecenas volutpat
    // blandit aliquam etiam erat. Nisi porta lorem mollis aliquam ut porttitor leo a. Nam at lectus
    // urna duis convallis. Aliquet porttitor lacus luctus accumsan tortor posuere. Est placerat in
    // egestas erat imperdiet sed euismod nisi. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc.
    // Nisi porta lorem mollis aliquam ut porttitor leo a. In mollis nunc sed id semper risus in
    // hendrerit gravida.`

		assert.strictEqual(actual, expected)
	});
});
