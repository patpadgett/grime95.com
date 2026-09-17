# grime95.com

Public GitHub Pages site. Flat HTML, generated.

Do not hand-edit anything here except styles.css, script.js, print.css, 404.html and assets/.
Everything else is written by the publisher's build step from content.json:

  content.json            appended one record per day by /data/pat/websites/grime95/grime95-publisher/publisher.py
                          from the private schedule /data/pat/websites/grime95/grime95-release/content.json.
                          Kept as the publisher's verification artifact; robots.txt disallows it; the browser never loads it.
  index.html              ledger with every booking pre-rendered as a real link
  rec/<booking>/index.html   one page per booking: story in HTML, <img> mugshot, own title/description/canonical/og, JSON-LD
  ledger.json             what script.js loads for FIND / SORT / LINEUP (all fields except the stories)
  about/index.html, sitemap.xml, feed.xml, robots.txt

Rebuild by hand (idempotent):
  python3 /data/pat/websites/grime95/grime95-publisher/build_site.py --webroot /data/pat/2_PUBLISHED/grime95.com

Legacy links of the form /#/rec/<booking> are rewritten client-side to /rec/<booking>/.
