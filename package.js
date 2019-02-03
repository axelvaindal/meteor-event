Package.describe({
  name: "m4dnation:meteor-event",

  version: "3.0.0-alpha.1",

  summary: "Event package for MeteorJS framework.",

  git: "https://github.com/M4dNation/meteor-event",
});

Npm.depends({
  jstoolbox: "1.0.2",
});

Package.onUse(function(api) {
  api.versionsFrom("1.8.0.2");

  api.use(["ecmascript"]);

  api.mainModule("src/meteor-event.js", "server");
});
