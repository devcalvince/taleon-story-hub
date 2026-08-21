//#region node_modules/.nitro/vite/services/ssr/assets/artwork-PyNNFBXk.js
var cover_last_signal_default = "/assets/cover-last-signal-5UghGo5L.jpg";
var cover_kilimanjaro_default = "/assets/cover-kilimanjaro-BfQBEKuh.jpg";
var cover_sector9_default = "/assets/cover-sector9-DGMlq0MA.jpg";
var cover_red_door_default = "/assets/cover-red-door-DfTq3C1K.jpg";
var cover_maua_default = "/assets/cover-maua-CwVp4B1B.jpg";
var cover_last_guardian_default = "/assets/cover-last-guardian-mq896XVl.jpg";
var hero_last_signal_default = "/assets/hero-last-signal-ZcGrl-x9.jpg";
/**
* Placeholder production artwork, keyed by story slug.
* Once a story has a `cover_url` in the database that value wins, so
* final artwork can be uploaded from the admin dashboard without code changes.
*/
var covers = {
	"the-last-signal": cover_last_signal_default,
	"shadow-of-kilimanjaro": cover_kilimanjaro_default,
	"the-girl-from-sector-9": cover_sector9_default,
	"the-red-door": cover_red_door_default,
	maua: cover_maua_default,
	"the-last-guardian": cover_last_guardian_default
};
var banners = { "the-last-signal": hero_last_signal_default };
function coverFor(story) {
	return story.cover_url || covers[story.slug] || "/assets/cover-last-signal-5UghGo5L.jpg";
}
function bannerFor(story) {
	return story.banner_url || banners[story.slug] || coverFor(story);
}
//#endregion
export { coverFor as n, bannerFor as t };
