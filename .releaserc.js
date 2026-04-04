module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/rj11io/lsdb-react.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        tarballDir: "dist",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "package-lock.json", "CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        failComment: false,
        assets: [
          { path: "dist/*.tgz", label: "npm package tarball" },
          { path: "CHANGELOG.md", label: "Changelog" },
        ],
      },
    ],
  ],
};
