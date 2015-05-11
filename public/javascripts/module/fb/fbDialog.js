/**
 * Created by Edward on 4/1/2015.
 */
function fbDialog(commentBody,commentRegion) {
    FB.ui(
        {
            method: 'feed',
            name: 'CarSafeApp',
            link: 'http://carsafeapp.heroku.com/',
            picture: 'http://carsafeapp.heroku.com/img/CarSafe-SM.png',
            caption: 'I just shared a comment in ' +commentRegion + ' neighbourhood!',
            description: commentBody
        },
        function (response) {
            if (response && response.post_id) {
                alert('Post was published.');
            } else {
                alert('Post was not published.');
            }
        }
    );

}