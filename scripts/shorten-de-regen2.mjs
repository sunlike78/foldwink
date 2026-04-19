/**
 * One-off: shorten too-long items in puzzles/de-regen2/ to fit MAX_ITEM=22.
 * Each fix is a from-string→to-string replacement. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("puzzles/de-regen2");

const fixes = [
  ["Schleicht zum Hühnerstall", "Geht zum Hühnerstall"],
  ["Kopf dreht fast ganz rum", "Kopf dreht fast rum"],
  ["Herzklopfen beim Klingeln", "Herzklopfen, klingelt"],
  ["Toilette nicht gefunden", "Toilette gesucht"],
  ["Ersten Buchstaben malen", "Erste Buchstaben"],
  ["Blase zwischen Strichen", "Blase im Strich"],
  ["Tiefenanschlag einstellen", "Tiefenanschlag setzen"],
  ["Paket zu groß für Kasten", "Paket zu groß"],
  ["Benachrichtigung im Schlitz", "Zettel im Briefkasten"],
  ["Wasser abstellen zuerst", "Wasser zuerst aus"],
  ["Schwimmabzeichen ablegen", "Seepferdchen machen"],
  ["Schüler springt vom Brett", "Sprung vom Brett"],
  ["Erkennt Knochen der Ahnen", "Findet alte Knochen"],
  ["Öffnet Schraubverschluss", "Öffnet Verschluss"],
  ["Tarnt sich sekundenschnell", "Tarnt sich blitzschnell"],
  ["Diagonalschritt im Wald", "Diagonal im Wald"],
  ["Kilometerlanger Rhythmus", "Km-langer Rhythmus"],
  ["Bindung anschnallen sitzend", "Bindung anschnallen"],
  ["Kante wechseln heelside", "Kante wechseln"],
  ["Strafrunde wenn verfehlt", "Strafrunde fällig"],
  ["Müesli kalt eingeweicht", "Müsli eingeweicht"],
  ["Haferflocken von gestern", "Haferflocken alt"],
  ["Rügenwalder aufgeschnitten", "Wurst aufgeschnitten"],
  ["Schwüle drückt auf Ohren", "Schwüle Luft drückt"],
  ["Geruch nach Wald und Ozon", "Riecht nach Ozon"],
  ["Haare stehen leicht auf", "Haare stehen auf"],
  ["Gewicht und Länge messen", "Maß und Gewicht"],
  ["Eisenblumen am Geländer", "Eisenblumen Geländer"],
  ["Symmetrie streng gehalten", "Strenge Symmetrie"],
  ["Pilaster glatt verputzt", "Pilaster verputzt"],
  ["Tarnt sich blitzschnell", "Tarnt blitzschnell"],
  ["Sichtbeton roh belassen", "Sichtbeton roh"],
  ["Fenster eingeschnitten tief", "Tiefe Fenster"],
  ["Keine Farbe keine Zierde", "Keine Zierde"],
  ["Wünsche an Sternschnuppe", "Wünsch dir was"],
  ["Weihnachtsmann kommt wirklich", "Weihnachtsmann kommt"],
  ["Frosch wird Prinz vielleicht", "Frosch wird Prinz"],
  ["Baum weint wenn gefällt", "Baum weint"],
  ["Stein ist traurig allein", "Stein ist traurig"],
  ["Auto schläft auch nachts", "Auto schläft nachts"],
  ["Foul eingestehen selbst", "Foul zugeben"],
  ["Handgeben nach Niederlage", "Handgeben nachher"],
  ["Zweiter ist erster Verlierer", "Zweiter = Verlierer"],
  ["Shirt nach Treffer heben", "Shirt heben"],
  ["Eigentor für Team akzeptiert", "Eigentor zugeben"],
  ["Amboss nimmt den Schlag", "Amboss schluckt Schlag"],
  ["Funken fliegen seitwärts", "Funken fliegen"],
  ["Schuss durch Kette treiben", "Kette schmieden"],
  ["Fell spannen zum Trocknen", "Fell spannen"],
  ["Fallschirmrakete abfeuern", "Rakete abfeuern"],
  ["Hände hoch zum Sprechen", "Hand hoch"],
  ["Rolle verteilen im Team", "Rollen verteilen"],
  ["Materialien selbst wählen", "Material wählen"],
  ["Aufgabe selbst bestimmt", "Aufgabe selbst"],
  ["Experte kommt zu Besuch", "Experte zu Besuch"],
  ["Hinter Besitzer stellen", "Hinter Besitzer"],
  ["Seil vom Pylon gespannt", "Seil am Pylon"],
  ["Wind lässt sie schwingen", "Wind schwingt sie"],
  ["Schiff passiert darunter", "Schiff passiert"],
  ["Schiffe tragen Fahrbahn", "Schiffe als Brücke"],
  ["Monosyllabische Antwort", "Einsilbig antworten"],
  ["Schritt rückwärts gemacht", "Schritt zurück"],
  ["Niemand weiß wo ich bin", "Niemand weiß wo"],
  ["Ohne Spiegel drei Wochen", "Ohne Spiegel"],
  ["Nichts planen für morgen", "Morgen nichts planen"],
];

let patched = 0;
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const filepath = path.join(DIR, f);
  let txt = fs.readFileSync(filepath, "utf8");
  let changed = false;
  for (const [from, to] of fixes) {
    const before = txt;
    txt = txt.split(`"${from}"`).join(`"${to}"`);
    if (txt !== before) changed = true;
  }
  if (changed) {
    fs.writeFileSync(filepath, txt, "utf8");
    patched++;
  }
}
console.log(`Patched ${patched} files`);
