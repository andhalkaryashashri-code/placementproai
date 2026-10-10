const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.placementproai-cluster.njuxjty.mongodb.net",
  (err, records) => {
    console.log("ERR:", err);
    console.log("RECORDS:", records);
  }
);