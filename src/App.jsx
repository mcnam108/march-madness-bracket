import { useState, useCallback, useMemo, useEffect } from "react";

// ============================================================
// TEAM DATA — All 68 teams with KenPom, style, injuries, momentum
// ============================================================

const TEAMS = {
  // EAST REGION
  "Duke": { seed: 1, region: "East", record: "32-2", kenpom: 1, adjO: 4, adjD: 2, adjEM: 33.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-elite", trait: "elite-two-way", momentum: "hot", momentumDetail: "Won ACC Tournament", injuries: [{ player: "Caleb Foster", status: "out", impact: 0.12, detail: "Broken foot — could return later rounds" }, { player: "Patrick Ngongba II", status: "questionable", impact: 0.08, detail: "Foot soreness — very unlikely R1" }], efg: 55.2, tov: 14.8, orb: 32.1, ftr: 38.5, efgD: 44.1, tovD: 20.5, orbD: 24.2, threePARate: 35.2, stealRate: 11.2, blockRate: 10.8 },
  "UConn": { seed: 2, region: "East", record: "29-5", kenpom: 6, adjO: 28, adjD: 11, adjEM: 25.1, pace: "moderate", offIdentity: "balanced", defIdentity: "man-physical", trait: "championship-DNA", momentum: "neutral", momentumDetail: "Lost Big East final to St. John's", injuries: [{ player: "Jaylin Stewart", status: "probable", impact: 0.04, detail: "Knee — expected back" }], efg: 50.8, tov: 16.2, orb: 30.5, ftr: 34.2, efgD: 45.8, tovD: 19.1, orbD: 25.1, threePARate: 33.1, stealRate: 10.1, blockRate: 9.5 },
  "Michigan St": { seed: 3, region: "East", record: "25-7", kenpom: 9, adjO: 24, adjD: 13, adjEM: 23.8, pace: "moderate", offIdentity: "ball-screen-heavy", defIdentity: "man-switch", trait: "vulnerable-to-zone", momentum: "neutral", momentumDetail: "Lost Big Ten semis", injuries: [], efg: 51.5, tov: 15.1, orb: 31.8, ftr: 36.2, efgD: 46.5, tovD: 18.8, orbD: 26.2, threePARate: 31.5, stealRate: 9.8, blockRate: 8.2 },
  "Kansas": { seed: 4, region: "East", record: "23-10", kenpom: 15, adjO: 18, adjD: 12, adjEM: 21.2, pace: "moderate", offIdentity: "guard-driven", defIdentity: "man-elite", trait: "volatile", momentum: "cold", momentumDetail: "Lost to Houston in Big 12 tourney, inconsistent all year", injuries: [{ player: "Darryn Peterson", status: "probable", impact: 0.05, detail: "In/out all season — availability saga" }], efg: 50.2, tov: 16.8, orb: 29.5, ftr: 35.1, efgD: 45.2, tovD: 19.8, orbD: 25.8, threePARate: 36.8, stealRate: 10.5, blockRate: 9.1 },
  "St. John's": { seed: 5, region: "East", record: "28-6", kenpom: 21, adjO: 44, adjD: 12, adjEM: 19.5, pace: "slow", offIdentity: "defense-to-offense", defIdentity: "man-pressure", trait: "no-pg", momentum: "hot", momentumDetail: "Won Big East Tournament", injuries: [], efg: 49.1, tov: 14.5, orb: 33.2, ftr: 37.8, efgD: 44.8, tovD: 21.2, orbD: 24.5, threePARate: 28.5, stealRate: 11.8, blockRate: 8.8 },
  "Louisville": { seed: 6, region: "East", record: "23-10", kenpom: 22, adjO: 20, adjD: 25, adjEM: 18.8, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-pressure", trait: "injury-hobbled", momentum: "cold", momentumDetail: "Lost without Brown in ACC tourney", injuries: [{ player: "Mikel Brown Jr.", status: "out", impact: 0.25, detail: "Back injury — out first weekend minimum" }], efg: 52.1, tov: 15.8, orb: 30.2, ftr: 36.5, efgD: 47.2, tovD: 19.5, orbD: 26.8, threePARate: 34.2, stealRate: 10.2, blockRate: 9.2 },
  "UCLA": { seed: 7, region: "East", record: "23-11", kenpom: 28, adjO: 35, adjD: 22, adjEM: 17.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-switch", trait: "injury-risk", momentum: "cold", momentumDetail: "Key injuries in Big Ten tourney", injuries: [{ player: "Tyler Bilodeau", status: "questionable", impact: 0.18, detail: "Knee strain — likely plays but limited" }, { player: "Donovan Dent", status: "questionable", impact: 0.12, detail: "Calf strain" }], efg: 50.5, tov: 15.5, orb: 29.8, ftr: 33.5, efgD: 46.8, tovD: 18.2, orbD: 26.5, threePARate: 35.5, stealRate: 9.5, blockRate: 8.5 },
  "Ohio State": { seed: 8, region: "East", record: "21-12", kenpom: 31, adjO: 38, adjD: 30, adjEM: 15.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "streaky", momentum: "hot", momentumDetail: "Won 4 straight before B1G loss", injuries: [{ player: "Devin Chatman", status: "questionable", impact: 0.06, detail: "Groin injury" }], efg: 49.8, tov: 16.1, orb: 30.1, ftr: 34.8, efgD: 47.5, tovD: 18.5, orbD: 27.1, threePARate: 33.8, stealRate: 9.2, blockRate: 7.8 },
  "TCU": { seed: 9, region: "East", record: "22-11", kenpom: 34, adjO: 42, adjD: 23, adjEM: 14.8, pace: "slow", offIdentity: "half-court", defIdentity: "man-physical", trait: "defensive-team", momentum: "neutral", momentumDetail: "Solid finish", injuries: [], efg: 49.2, tov: 15.2, orb: 31.2, ftr: 35.5, efgD: 46.2, tovD: 19.2, orbD: 25.5, threePARate: 30.2, stealRate: 9.8, blockRate: 8.5 },
  "UCF": { seed: 10, region: "East", record: "21-11", kenpom: 38, adjO: 45, adjD: 35, adjEM: 13.2, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "athletic", momentum: "neutral", momentumDetail: "Decent Big 12 finish", injuries: [], efg: 50.1, tov: 16.5, orb: 29.2, ftr: 33.2, efgD: 48.1, tovD: 17.8, orbD: 27.5, threePARate: 34.5, stealRate: 9.5, blockRate: 8.8 },
  "South Florida": { seed: 11, region: "East", record: "25-8", kenpom: 46, adjO: 55, adjD: 40, adjEM: 11.5, pace: "slow", offIdentity: "half-court", defIdentity: "zone-heavy", trait: "11-game-win-streak", momentum: "hot", momentumDetail: "Won 11 straight", injuries: [], efg: 48.5, tov: 14.8, orb: 32.5, ftr: 36.2, efgD: 47.8, tovD: 19.8, orbD: 25.2, threePARate: 29.8, stealRate: 10.5, blockRate: 9.1 },
  "N. Iowa": { seed: 12, region: "East", record: "23-12", kenpom: 49, adjO: 62, adjD: 25, adjEM: 10.8, pace: "slow", offIdentity: "grind", defIdentity: "man-packline", trait: "elite-defense-mid", momentum: "hot", momentumDetail: "Won MVC Tournament", injuries: [], efg: 47.8, tov: 14.2, orb: 30.8, ftr: 34.5, efgD: 45.5, tovD: 20.5, orbD: 24.8, threePARate: 28.2, stealRate: 10.2, blockRate: 8.2 },
  "Cal Baptist": { seed: 13, region: "East", record: "25-8", kenpom: 51, adjO: 58, adjD: 48, adjEM: 9.5, pace: "moderate", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "first-time-tourney", momentum: "neutral", momentumDetail: "Won WAC Tournament", injuries: [], efg: 50.2, tov: 15.8, orb: 28.5, ftr: 32.1, efgD: 48.5, tovD: 17.5, orbD: 28.2, threePARate: 40.2, stealRate: 8.5, blockRate: 7.5 },
  "N. Dakota St": { seed: 14, region: "East", record: "27-7", kenpom: 55, adjO: 65, adjD: 50, adjEM: 8.2, pace: "slow", offIdentity: "half-court", defIdentity: "man-standard", trait: "disciplined", momentum: "neutral", momentumDetail: "Won Summit League", injuries: [], efg: 49.5, tov: 14.5, orb: 29.5, ftr: 33.8, efgD: 48.2, tovD: 18.2, orbD: 27.8, threePARate: 32.5, stealRate: 8.8, blockRate: 7.2 },
  "Furman": { seed: 15, region: "East", record: "22-12", kenpom: 80, adjO: 72, adjD: 88, adjEM: 3.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "tourney-surge", momentum: "hot", momentumDetail: "Caught fire in SoCon tourney", injuries: [], efg: 48.2, tov: 16.5, orb: 28.2, ftr: 31.5, efgD: 50.2, tovD: 16.8, orbD: 29.5, threePARate: 36.8, stealRate: 8.2, blockRate: 6.5 },
  "Siena": { seed: 16, region: "East", record: "23-11", kenpom: 145, adjO: 140, adjD: 135, adjEM: -2.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "first-in-16-years", momentum: "hot", momentumDetail: "Won MAAC Tournament", injuries: [], efg: 46.5, tov: 17.2, orb: 28.8, ftr: 30.2, efgD: 51.8, tovD: 16.2, orbD: 30.5, threePARate: 33.2, stealRate: 8.5, blockRate: 6.8 },

  // WEST REGION
  "Arizona": { seed: 1, region: "West", record: "32-2", kenpom: 3, adjO: 5, adjD: 3, adjEM: 31.2, pace: "fast", offIdentity: "balanced", defIdentity: "man-switch", trait: "elite-two-way", momentum: "hot", momentumDetail: "Dominant all season", injuries: [], efg: 54.8, tov: 14.5, orb: 32.8, ftr: 38.2, efgD: 43.8, tovD: 20.8, orbD: 23.5, threePARate: 34.8, stealRate: 11.5, blockRate: 10.5 },
  "Purdue": { seed: 2, region: "West", record: "27-8", kenpom: 8, adjO: 2, adjD: 36, adjEM: 24.2, pace: "slow", offIdentity: "paint-dominant", defIdentity: "man-standard", trait: "elite-offense", momentum: "hot", momentumDetail: "Won Big Ten Tournament", injuries: [], efg: 55.8, tov: 13.8, orb: 34.2, ftr: 40.1, efgD: 48.5, tovD: 17.2, orbD: 27.2, threePARate: 30.5, stealRate: 8.5, blockRate: 9.8 },
  "Gonzaga": { seed: 3, region: "West", record: "30-3", kenpom: 11, adjO: 29, adjD: 9, adjEM: 22.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-help", trait: "deep-tourney-exp", momentum: "hot", momentumDetail: "Won WCC Tournament", injuries: [{ player: "Braden Huff", status: "doubtful", impact: 0.15, detail: "Knee — out since January, ramping up" }], efg: 51.2, tov: 15.2, orb: 31.5, ftr: 35.8, efgD: 45.2, tovD: 19.5, orbD: 24.8, threePARate: 33.5, stealRate: 9.8, blockRate: 9.5 },
  "Arkansas": { seed: 4, region: "West", record: "26-8", kenpom: 16, adjO: 6, adjD: 46, adjEM: 20.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-pressure", trait: "elite-offense", momentum: "neutral", momentumDetail: "Lost SEC semis", injuries: [], efg: 53.5, tov: 16.2, orb: 33.5, ftr: 39.2, efgD: 49.2, tovD: 18.2, orbD: 27.5, threePARate: 33.8, stealRate: 11.2, blockRate: 8.5 },
  "Wisconsin": { seed: 5, region: "West", record: "24-10", kenpom: 24, adjO: 30, adjD: 62, adjEM: 17.8, pace: "slow", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "giant-killer", momentum: "hot", momentumDetail: "Beat Michigan, Illinois, MSU", injuries: [{ player: "Nolan Winter", status: "probable", impact: 0.03, detail: "Minor — expects to play" }], efg: 51.8, tov: 13.5, orb: 28.5, ftr: 32.2, efgD: 49.5, tovD: 17.5, orbD: 28.5, threePARate: 38.5, stealRate: 8.2, blockRate: 7.5 },
  "BYU": { seed: 6, region: "West", record: "23-11", kenpom: 25, adjO: 15, adjD: 38, adjEM: 17.5, pace: "moderate", offIdentity: "star-driven", defIdentity: "man-switch", trait: "dybantsa-factor", momentum: "cold", momentumDetail: "Under .500 since Saunders injury", injuries: [{ player: "Richie Saunders", status: "out", impact: 0.22, detail: "Season-ending torn ACL" }], efg: 52.5, tov: 15.5, orb: 30.2, ftr: 36.8, efgD: 48.2, tovD: 18.5, orbD: 27.2, threePARate: 35.2, stealRate: 9.5, blockRate: 8.8 },
  "Miami FL": { seed: 7, region: "West", record: "25-8", kenpom: 27, adjO: 22, adjD: 34, adjEM: 17.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-switch", trait: "experienced", momentum: "neutral", momentumDetail: "Solid ACC season", injuries: [], efg: 51.2, tov: 15.2, orb: 29.8, ftr: 34.5, efgD: 47.5, tovD: 18.8, orbD: 26.8, threePARate: 35.8, stealRate: 9.8, blockRate: 8.2 },
  "Villanova": { seed: 8, region: "West", record: "24-8", kenpom: 33, adjO: 32, adjD: 42, adjEM: 15.2, pace: "slow", offIdentity: "half-court", defIdentity: "man-standard", trait: "disciplined", momentum: "neutral", momentumDetail: "Steady Big East season", injuries: [], efg: 50.5, tov: 14.2, orb: 29.2, ftr: 33.8, efgD: 47.8, tovD: 18.2, orbD: 27.5, threePARate: 36.2, stealRate: 8.8, blockRate: 7.8 },
  "Utah St": { seed: 9, region: "West", record: "28-6", kenpom: 32, adjO: 36, adjD: 32, adjEM: 15.5, pace: "slow", offIdentity: "half-court", defIdentity: "man-packline", trait: "underseeded", momentum: "hot", momentumDetail: "Won MWC Tournament", injuries: [], efg: 50.8, tov: 14.5, orb: 31.5, ftr: 35.2, efgD: 47.2, tovD: 19.2, orbD: 26.2, threePARate: 32.5, stealRate: 9.5, blockRate: 8.5 },
  "Missouri": { seed: 10, region: "West", record: "20-12", kenpom: 51, adjO: 48, adjD: 55, adjEM: 10.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "inconsistent", momentum: "neutral", momentumDetail: "Up and down SEC season", injuries: [], efg: 49.5, tov: 15.8, orb: 30.5, ftr: 34.2, efgD: 49.2, tovD: 17.8, orbD: 28.2, threePARate: 33.5, stealRate: 9.2, blockRate: 7.8 },
  "Texas": { seed: 11, region: "West", record: "18-14", kenpom: 42, adjO: 38, adjD: 48, adjEM: 12.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "first-four-winner", momentum: "hot", momentumDetail: "Won First Four over NC State", injuries: [], efg: 50.5, tov: 15.2, orb: 30.5, ftr: 35.2, efgD: 48.8, tovD: 18.0, orbD: 27.8, threePARate: 33.8, stealRate: 9.2, blockRate: 8.5 },
  "High Point": { seed: 12, region: "West", record: "30-4", kenpom: 50, adjO: 52, adjD: 52, adjEM: 10.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-pressure", trait: "30-win-mid-major", momentum: "hot", momentumDetail: "Dominant Big South season", injuries: [], efg: 50.5, tov: 16.2, orb: 31.2, ftr: 35.8, efgD: 48.8, tovD: 18.5, orbD: 27.2, threePARate: 35.5, stealRate: 10.5, blockRate: 7.5 },
  "Hawaii": { seed: 13, region: "West", record: "24-8", kenpom: 54, adjO: 50, adjD: 60, adjEM: 9.8, pace: "fast", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "big-west-champs", momentum: "hot", momentumDetail: "Won Big West Tournament", injuries: [], efg: 50.8, tov: 15.5, orb: 28.8, ftr: 32.5, efgD: 49.5, tovD: 17.2, orbD: 28.8, threePARate: 39.5, stealRate: 8.8, blockRate: 7.2 },
  "Kennesaw St": { seed: 14, region: "West", record: "21-13", kenpom: 95, adjO: 98, adjD: 92, adjEM: 2.2, pace: "slow", offIdentity: "half-court", defIdentity: "man-standard", trait: "ASUN-champs", momentum: "neutral", momentumDetail: "Won ASUN Tournament", injuries: [], efg: 47.5, tov: 16.8, orb: 29.5, ftr: 33.2, efgD: 50.5, tovD: 17.5, orbD: 29.2, threePARate: 31.5, stealRate: 8.5, blockRate: 7.2 },
  "Queens": { seed: 15, region: "West", record: "21-13", kenpom: 130, adjO: 125, adjD: 128, adjEM: -1.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "first-year-eligible", momentum: "hot", momentumDetail: "First-ever tourney appearance", injuries: [], efg: 47.2, tov: 16.5, orb: 29.2, ftr: 31.8, efgD: 51.2, tovD: 16.5, orbD: 30.2, threePARate: 34.5, stealRate: 8.2, blockRate: 6.8 },
  "LIU": { seed: 16, region: "West", record: "24-10", kenpom: 155, adjO: 150, adjD: 148, adjEM: -4.2, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "NEC-champs", momentum: "hot", momentumDetail: "Won NEC Tournament", injuries: [], efg: 46.2, tov: 17.5, orb: 28.5, ftr: 30.5, efgD: 52.5, tovD: 15.8, orbD: 31.2, threePARate: 35.8, stealRate: 8.8, blockRate: 6.2 },

  // MIDWEST REGION
  "Michigan": { seed: 1, region: "Midwest", record: "31-3", kenpom: 2, adjO: 8, adjD: 1, adjEM: 32.8, pace: "moderate", offIdentity: "balanced", defIdentity: "man-elite", trait: "elite-defense", momentum: "neutral", momentumDetail: "Lost Big Ten final to Purdue", injuries: [{ player: "L.J. Cason", status: "out", impact: 0.10, detail: "Season-ending torn ACL" }], efg: 54.2, tov: 14.2, orb: 32.5, ftr: 37.8, efgD: 43.2, tovD: 21.2, orbD: 23.2, threePARate: 33.8, stealRate: 11.8, blockRate: 11.2 },
  "Iowa St": { seed: 2, region: "Midwest", record: "27-7", kenpom: 7, adjO: 21, adjD: 4, adjEM: 24.5, pace: "slow", offIdentity: "three-point-heavy", defIdentity: "man-pressure", trait: "disruptive-defense", momentum: "hot", momentumDetail: "Strong Big 12 finish", injuries: [], efg: 51.5, tov: 14.8, orb: 30.2, ftr: 33.5, efgD: 44.5, tovD: 22.5, orbD: 24.2, threePARate: 38.2, stealRate: 12.8, blockRate: 8.5 },
  "Virginia": { seed: 3, region: "Midwest", record: "29-5", kenpom: 13, adjO: 27, adjD: 16, adjEM: 21.8, pace: "slow", offIdentity: "half-court", defIdentity: "packline", trait: "slow-grind", momentum: "hot", momentumDetail: "Won ACC regular season", injuries: [], efg: 50.2, tov: 13.2, orb: 29.8, ftr: 34.2, efgD: 45.5, tovD: 19.8, orbD: 24.5, threePARate: 30.8, stealRate: 8.5, blockRate: 9.2 },
  "Alabama": { seed: 4, region: "Midwest", record: "23-9", kenpom: 17, adjO: 10, adjD: 68, adjEM: 20.2, pace: "fast", offIdentity: "three-point-heavy", defIdentity: "man-gambling", trait: "highest-scoring", momentum: "cold", momentumDetail: "Holloway arrested, chaos", injuries: [{ player: "Aden Holloway", status: "doubtful", impact: 0.20, detail: "Arrested — felony drug charge, removed from campus" }], efg: 53.2, tov: 16.8, orb: 31.5, ftr: 37.2, efgD: 50.5, tovD: 18.2, orbD: 28.5, threePARate: 40.5, stealRate: 10.5, blockRate: 7.2 },
  "Texas Tech": { seed: 5, region: "Midwest", record: "22-10", kenpom: 19, adjO: 12, adjD: 33, adjEM: 19.5, pace: "slow", offIdentity: "balanced", defIdentity: "man-physical", trait: "lost-star", momentum: "cold", momentumDetail: "Without Toppin since Feb", injuries: [{ player: "JT Toppin", status: "out", impact: 0.28, detail: "Season-ending torn ACL — was 21.8 PPG" }], efg: 51.2, tov: 14.5, orb: 30.8, ftr: 35.5, efgD: 47.5, tovD: 19.5, orbD: 26.5, threePARate: 33.2, stealRate: 10.2, blockRate: 8.8 },
  "Tennessee": { seed: 6, region: "Midwest", record: "22-11", kenpom: 14, adjO: 37, adjD: 15, adjEM: 21.5, pace: "slow", offIdentity: "grind", defIdentity: "man-physical", trait: "defense-only", momentum: "neutral", momentumDetail: "Back-to-back Elite Eights as 2-seed, now 6", injuries: [], efg: 46.8, tov: 14.2, orb: 32.8, ftr: 38.5, efgD: 44.8, tovD: 20.8, orbD: 24.2, threePARate: 27.5, stealRate: 10.8, blockRate: 10.2 },
  "Kentucky": { seed: 7, region: "Midwest", record: "21-13", kenpom: 26, adjO: 25, adjD: 28, adjEM: 17.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-switch", trait: "13-losses", momentum: "cold", momentumDetail: "Lost 4 games to unranked teams", injuries: [], efg: 51.2, tov: 16.5, orb: 31.2, ftr: 36.8, efgD: 48.2, tovD: 18.5, orbD: 27.2, threePARate: 34.8, stealRate: 9.8, blockRate: 8.8 },
  "Georgia": { seed: 8, region: "Midwest", record: "22-10", kenpom: 30, adjO: 33, adjD: 31, adjEM: 16.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "susceptible", momentum: "neutral", momentumDetail: "Decent SEC finish", injuries: [], efg: 50.5, tov: 15.8, orb: 30.5, ftr: 34.8, efgD: 47.8, tovD: 18.8, orbD: 27.2, threePARate: 33.5, stealRate: 9.2, blockRate: 8.2 },
  "Saint Louis": { seed: 9, region: "Midwest", record: "28-5", kenpom: 35, adjO: 40, adjD: 35, adjEM: 14.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "A10-champs", momentum: "hot", momentumDetail: "Won A-10 Tournament", injuries: [], efg: 50.2, tov: 14.8, orb: 31.2, ftr: 35.5, efgD: 47.5, tovD: 19.2, orbD: 26.5, threePARate: 32.8, stealRate: 9.8, blockRate: 8.5 },
  "Santa Clara": { seed: 10, region: "Midwest", record: "26-8", kenpom: 37, adjO: 23, adjD: 55, adjEM: 13.8, pace: "moderate", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "three-point-barrage", momentum: "neutral", momentumDetail: "Lost WCC final to Gonzaga", injuries: [], efg: 52.5, tov: 14.2, orb: 28.2, ftr: 31.5, efgD: 49.5, tovD: 17.5, orbD: 28.8, threePARate: 42.5, stealRate: 8.5, blockRate: 7.2 },
  "Miami OH": { seed: 11, region: "Midwest", record: "31-1", kenpom: 44, adjO: 42, adjD: 48, adjEM: 12.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "31-1-record", momentum: "cold", momentumDetail: "Lost MAC tourney after 31-0 start", injuries: [], efg: 51.2, tov: 14.5, orb: 30.8, ftr: 34.5, efgD: 48.2, tovD: 18.5, orbD: 27.5, threePARate: 34.8, stealRate: 9.2, blockRate: 7.8 },
  "Akron": { seed: 12, region: "Midwest", record: "29-5", kenpom: 48, adjO: 50, adjD: 50, adjEM: 11.2, pace: "moderate", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "3rd-straight-tourney", momentum: "hot", momentumDetail: "Won MAC, 3 guards 37%+ from 3", injuries: [], efg: 51.8, tov: 14.8, orb: 29.5, ftr: 33.2, efgD: 48.5, tovD: 18.2, orbD: 27.8, threePARate: 39.8, stealRate: 9.2, blockRate: 7.5 },
  "Hofstra": { seed: 13, region: "Midwest", record: "24-10", kenpom: 52, adjO: 55, adjD: 52, adjEM: 10.2, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "CAA-champs", momentum: "hot", momentumDetail: "Won CAA Tournament", injuries: [], efg: 50.2, tov: 16.2, orb: 30.2, ftr: 34.8, efgD: 49.2, tovD: 17.8, orbD: 28.2, threePARate: 35.5, stealRate: 9.5, blockRate: 7.2 },
  "Wright St": { seed: 14, region: "Midwest", record: "23-11", kenpom: 57, adjO: 60, adjD: 58, adjEM: 8.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "Horizon-champs", momentum: "neutral", momentumDetail: "Won Horizon League", injuries: [], efg: 49.5, tov: 15.5, orb: 30.5, ftr: 34.2, efgD: 49.5, tovD: 18.2, orbD: 28.2, threePARate: 33.2, stealRate: 9.2, blockRate: 7.5 },
  "Tenn St": { seed: 15, region: "Midwest", record: "23-9", kenpom: 110, adjO: 105, adjD: 112, adjEM: 0.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "OVC-champs", momentum: "hot", momentumDetail: "Won OVC, first tourney since 1994", injuries: [], efg: 47.5, tov: 17.2, orb: 29.8, ftr: 33.5, efgD: 51.5, tovD: 16.5, orbD: 30.2, threePARate: 34.2, stealRate: 9.5, blockRate: 6.8 },
  "Howard": { seed: 16, region: "Midwest", record: "23-10", kenpom: 120, adjO: 118, adjD: 115, adjEM: -0.8, pace: "fast", offIdentity: "guard-driven", defIdentity: "man-standard", trait: "MEAC-champs", momentum: "hot", momentumDetail: "Won First Four", injuries: [], efg: 47.8, tov: 17.5, orb: 29.2, ftr: 32.8, efgD: 51.8, tovD: 16.2, orbD: 30.5, threePARate: 35.8, stealRate: 9.8, blockRate: 6.5 },

  // SOUTH REGION
  "Florida": { seed: 1, region: "South", record: "26-7", kenpom: 4, adjO: 9, adjD: 6, adjEM: 28.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-switch", trait: "defending-champ", momentum: "neutral", momentumDetail: "Lost SEC semis but still elite", injuries: [], efg: 54.2, tov: 14.8, orb: 31.8, ftr: 37.5, efgD: 44.5, tovD: 20.2, orbD: 24.5, threePARate: 34.5, stealRate: 10.8, blockRate: 10.2 },
  "Houston": { seed: 2, region: "South", record: "28-6", kenpom: 5, adjO: 14, adjD: 5, adjEM: 27.2, pace: "slow", offIdentity: "paint-dominant", defIdentity: "man-physical", trait: "defensive-juggernaut", momentum: "hot", momentumDetail: "Won Big 12 Tournament", injuries: [], efg: 52.8, tov: 14.2, orb: 34.5, ftr: 39.5, efgD: 43.5, tovD: 21.5, orbD: 23.8, threePARate: 29.5, stealRate: 11.5, blockRate: 11.8 },
  "Illinois": { seed: 3, region: "South", record: "24-8", kenpom: 10, adjO: 1, adjD: 28, adjEM: 23.5, pace: "fast", offIdentity: "three-point-heavy", defIdentity: "man-switch", trait: "elite-offense", momentum: "neutral", momentumDetail: "Strong Big Ten season, lost semis", injuries: [], efg: 55.5, tov: 14.5, orb: 32.2, ftr: 38.8, efgD: 47.8, tovD: 18.5, orbD: 26.8, threePARate: 37.5, stealRate: 10.2, blockRate: 8.8 },
  "Nebraska": { seed: 4, region: "South", record: "28-6", kenpom: 14, adjO: 55, adjD: 7, adjEM: 21.5, pace: "slow", offIdentity: "grind", defIdentity: "man-pressure", trait: "defensive-surprise", momentum: "hot", momentumDetail: "Best D in Big Ten, forces TOs", injuries: [], efg: 48.5, tov: 13.8, orb: 31.5, ftr: 35.2, efgD: 44.2, tovD: 22.2, orbD: 24.2, threePARate: 32.5, stealRate: 12.2, blockRate: 9.5 },
  "Vanderbilt": { seed: 5, region: "South", record: "26-8", kenpom: 12, adjO: 7, adjD: 29, adjEM: 22.2, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "dark-horse", momentum: "hot", momentumDetail: "Made SEC Championship game", injuries: [], efg: 53.8, tov: 15.2, orb: 31.2, ftr: 36.5, efgD: 47.5, tovD: 18.8, orbD: 26.5, threePARate: 34.8, stealRate: 9.8, blockRate: 8.5 },
  "North Carolina": { seed: 6, region: "South", record: "24-8", kenpom: 20, adjO: 16, adjD: 26, adjEM: 19.8, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "lost-star", momentum: "cold", momentumDetail: "Without Caleb Wilson (surgery)", injuries: [{ player: "Caleb Wilson", status: "out", impact: 0.30, detail: "Season-ending thumb surgery — was 19.8 PPG" }], efg: 52.5, tov: 15.8, orb: 33.5, ftr: 38.2, efgD: 47.2, tovD: 18.5, orbD: 26.2, threePARate: 33.5, stealRate: 9.5, blockRate: 8.5 },
  "Saint Mary's": { seed: 7, region: "South", record: "27-5", kenpom: 23, adjO: 45, adjD: 18, adjEM: 18.5, pace: "slow", offIdentity: "half-court", defIdentity: "man-physical", trait: "elite-defense-mid", momentum: "neutral", momentumDetail: "Solid WCC season", injuries: [], efg: 49.5, tov: 13.8, orb: 30.8, ftr: 34.8, efgD: 45.8, tovD: 19.5, orbD: 25.2, threePARate: 30.2, stealRate: 9.2, blockRate: 9.5 },
  "Clemson": { seed: 8, region: "South", record: "24-10", kenpom: 29, adjO: 34, adjD: 27, adjEM: 16.8, pace: "moderate", offIdentity: "balanced", defIdentity: "man-switch", trait: "solid-both-ways", momentum: "neutral", momentumDetail: "Steady ACC season", injuries: [], efg: 50.8, tov: 15.2, orb: 30.2, ftr: 34.5, efgD: 47.2, tovD: 19.2, orbD: 26.8, threePARate: 34.2, stealRate: 9.5, blockRate: 8.8 },
  "Iowa": { seed: 9, region: "South", record: "21-12", kenpom: 36, adjO: 26, adjD: 50, adjEM: 14.2, pace: "fast", offIdentity: "three-point-heavy", defIdentity: "man-standard", trait: "offensive-firepower", momentum: "neutral", momentumDetail: "Streaky Big Ten season", injuries: [], efg: 52.2, tov: 15.5, orb: 29.5, ftr: 33.8, efgD: 49.2, tovD: 17.5, orbD: 28.2, threePARate: 38.8, stealRate: 8.8, blockRate: 7.5 },
  "Texas A&M": { seed: 10, region: "South", record: "21-11", kenpom: 40, adjO: 43, adjD: 40, adjEM: 13.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-physical", trait: "athletic", momentum: "neutral", momentumDetail: "Mid-tier SEC finish", injuries: [], efg: 50.2, tov: 15.8, orb: 31.5, ftr: 36.2, efgD: 48.5, tovD: 18.2, orbD: 27.5, threePARate: 32.5, stealRate: 9.8, blockRate: 8.8 },
  "VCU": { seed: 11, region: "South", record: "27-7", kenpom: 47, adjO: 52, adjD: 42, adjEM: 11.8, pace: "fast", offIdentity: "transition-heavy", defIdentity: "press-trap", trait: "havoc-defense", momentum: "hot", momentumDetail: "Won A-10 regular season", injuries: [], efg: 49.2, tov: 16.8, orb: 32.8, ftr: 37.5, efgD: 48.2, tovD: 21.8, orbD: 26.2, threePARate: 31.5, stealRate: 13.2, blockRate: 8.2 },
  "McNeese": { seed: 12, region: "South", record: "28-5", kenpom: 47, adjO: 48, adjD: 48, adjEM: 11.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "3rd-straight-tourney", momentum: "hot", momentumDetail: "Won Southland again", injuries: [], efg: 50.8, tov: 15.2, orb: 30.5, ftr: 34.8, efgD: 48.5, tovD: 18.5, orbD: 27.5, threePARate: 34.5, stealRate: 9.5, blockRate: 7.8 },
  "Troy": { seed: 13, region: "South", record: "22-11", kenpom: 53, adjO: 56, adjD: 55, adjEM: 9.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "Sun-Belt-champs", momentum: "hot", momentumDetail: "Won Sun Belt Tournament", injuries: [], efg: 49.8, tov: 16.2, orb: 30.2, ftr: 34.2, efgD: 49.5, tovD: 17.8, orbD: 28.5, threePARate: 35.2, stealRate: 9.5, blockRate: 7.2 },
  "Penn": { seed: 14, region: "South", record: "18-11", kenpom: 56, adjO: 58, adjD: 58, adjEM: 8.8, pace: "slow", offIdentity: "half-court", defIdentity: "man-standard", trait: "ivy-champs", momentum: "hot", momentumDetail: "Won 9 of last 10, Ivy tourney champs", injuries: [{ player: "Ethan Roberts", status: "questionable", impact: 0.15, detail: "Concussion — availability unclear" }], efg: 49.2, tov: 14.5, orb: 29.8, ftr: 33.5, efgD: 49.2, tovD: 18.2, orbD: 28.5, threePARate: 31.8, stealRate: 8.5, blockRate: 7.5 },
  "Idaho": { seed: 15, region: "South", record: "21-14", kenpom: 100, adjO: 95, adjD: 102, adjEM: 1.5, pace: "moderate", offIdentity: "balanced", defIdentity: "man-standard", trait: "big-sky-champs", momentum: "hot", momentumDetail: "First tourney since 1990", injuries: [], efg: 48.2, tov: 16.5, orb: 29.5, ftr: 33.2, efgD: 50.8, tovD: 17.2, orbD: 29.5, threePARate: 33.5, stealRate: 8.8, blockRate: 7.2 },
  "Prairie View": { seed: 16, region: "South", record: "18-17", kenpom: 160, adjO: 155, adjD: 158, adjEM: -5.5, pace: "fast", offIdentity: "transition-heavy", defIdentity: "man-standard", trait: "SWAC-champs", momentum: "neutral", momentumDetail: "Won SWAC, but sub-.500", injuries: [], efg: 45.5, tov: 18.2, orb: 28.2, ftr: 30.5, efgD: 53.2, tovD: 15.5, orbD: 31.5, threePARate: 34.2, stealRate: 9.2, blockRate: 6.2 },
};

// First Four results (already played or playing today)
// Texas won over NC State; Howard won over UMBC; SMU vs Miami OH and Lehigh vs Prairie View TBD
// We'll use NC State as placeholder for West 11 and Howard for Midwest 16

const BRACKET = {
  East: [
    ["Duke", "Siena"], ["Ohio State", "TCU"], ["St. John's", "N. Iowa"], ["Kansas", "Cal Baptist"],
    ["Louisville", "South Florida"], ["Michigan St", "N. Dakota St"], ["UCLA", "UCF"], ["UConn", "Furman"]
  ],
  West: [
    ["Arizona", "LIU"], ["Villanova", "Utah St"], ["Wisconsin", "High Point"], ["Arkansas", "Hawaii"],
    ["BYU", "Texas"], ["Gonzaga", "Kennesaw St"], ["Miami FL", "Missouri"], ["Purdue", "Queens"]
  ],
  Midwest: [
    ["Michigan", "Howard"], ["Georgia", "Saint Louis"], ["Texas Tech", "Akron"], ["Alabama", "Hofstra"],
    ["Tennessee", "Miami OH"], ["Virginia", "Wright St"], ["Kentucky", "Santa Clara"], ["Iowa St", "Tenn St"]
  ],
  South: [
    ["Florida", "Prairie View"], ["Clemson", "Iowa"], ["Vanderbilt", "McNeese"], ["Nebraska", "Troy"],
    ["North Carolina", "VCU"], ["Illinois", "Penn"], ["Saint Mary's", "Texas A&M"], ["Houston", "Idaho"]
  ]
};

// ============================================================
// SIMULATION ENGINE
// ============================================================

const STYLE_MATCHUPS = {
  "zone-heavy_ball-screen-heavy": -4.5,
  "packline_transition-heavy": -3.5,
  "press-trap_guard-driven": 3.5,
  "man-pressure_three-point-heavy": -2.0,
  "man-physical_transition-heavy": -2.5,
  "man-elite_three-point-heavy": 2.5,
  "packline_three-point-heavy": -3.0,
  "press-trap_balanced": 1.5,
  "man-gambling_half-court": -2.0,
  "zone-heavy_three-point-heavy": -4.0,
  "man-physical_paint-dominant": -1.5,
  "man-switch_star-driven": 2.0,
};

function getStyleModifier(teamA, teamB) {
  let mod = 0;
  const keyAB = `${teamA.defIdentity}_${teamB.offIdentity}`;
  const keyBA = `${teamB.defIdentity}_${teamA.offIdentity}`;
  if (STYLE_MATCHUPS[keyAB]) mod += STYLE_MATCHUPS[keyAB];
  if (STYLE_MATCHUPS[keyBA]) mod -= STYLE_MATCHUPS[keyBA];
  // Pace mismatch
  if (teamA.pace === "slow" && teamB.pace === "fast") mod += 1.5;
  if (teamA.pace === "fast" && teamB.pace === "slow") mod -= 1.5;
  return mod;
}

function getMomentumScore(team) {
  if (team.momentum === "hot") return 2.0;
  if (team.momentum === "cold") return -2.0;
  return 0;
}

function getInjuryPenalty(team) {
  if (!team.injuries || team.injuries.length === 0) return 0;
  return team.injuries.reduce((sum, inj) => {
    if (inj.status === "out") return sum + inj.impact * 100;
    if (inj.status === "doubtful") return sum + inj.impact * 80;
    if (inj.status === "questionable") return sum + inj.impact * 50;
    if (inj.status === "probable") return sum + inj.impact * 15;
    return sum;
  }, 0);
}

function computePowerScore(teamName) {
  const t = TEAMS[teamName];
  if (!t) return 0;
  const kenpomScore = Math.max(0, (180 - t.kenpom)) * 0.4;
  const fourFactors = ((60 - Math.min(t.adjO, 60)) + (60 - Math.min(t.adjD, 60))) * 0.25;
  const momentum = getMomentumScore(t) * 2;
  const injPenalty = getInjuryPenalty(t);
  return kenpomScore + fourFactors + momentum - injPenalty;
}

function simulateMatchup(nameA, nameB) {
  const teamA = TEAMS[nameA];
  const teamB = TEAMS[nameB];
  if (!teamA || !teamB) return { winner: nameA, winPct: 100, margin: 20 };
  const scoreA = computePowerScore(nameA);
  const scoreB = computePowerScore(nameB);
  let diff = scoreA - scoreB;
  diff += getStyleModifier(teamA, teamB);
  const margin = diff * 0.45;
  const winPctA = 1 / (1 + Math.pow(10, -diff / 18));
  const pct = Math.round(winPctA * 100);
  if (pct >= 50) return { winner: nameA, loser: nameB, winPct: pct, margin: Math.abs(margin).toFixed(1) };
  return { winner: nameB, loser: nameA, winPct: 100 - pct, margin: Math.abs(margin).toFixed(1) };
}

// ============================================================
// REACT APP
// ============================================================

const REGION_COLORS = {
  East: { bg: "#1a3a5c", accent: "#4fa3e3", light: "#e8f4fd" },
  West: { bg: "#5c1a1a", accent: "#e34f4f", light: "#fde8e8" },
  Midwest: { bg: "#1a5c2e", accent: "#4fe370", light: "#e8fded" },
  South: { bg: "#5c4a1a", accent: "#e3b44f", light: "#fdf5e8" },
};

function TeamPill({ name, seed, isWinner, onClick, small, highlight, onInfo }) {
  const team = TEAMS[name];
  if (!name) return <div style={{ ...styles.teamPill, opacity: 0.3, background: "#1a1a2e" }}><span style={styles.seedBadge}>?</span><span style={styles.teamName}>TBD</span></div>;
  const hasInjury = team?.injuries?.some(i => i.status === "out" || i.status === "doubtful");
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.teamPill,
        ...(small ? styles.teamPillSmall : {}),
        background: isWinner ? "linear-gradient(135deg, #0d7a3e 0%, #14532d 100%)" : highlight ? "linear-gradient(135deg, #2a2a4a 0%, #1a1a3a 100%)" : "#12121f",
        border: isWinner ? "1px solid #22c55e" : highlight ? "1px solid #6366f1" : "1px solid #2a2a3e",
        cursor: onClick ? "pointer" : "default",
        transform: highlight ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span style={{ ...styles.seedBadge, background: isWinner ? "#22c55e" : "#333355" }}>{seed}</span>
      <span style={{ ...styles.teamName, color: isWinner ? "#bbf7d0" : "#e2e2f0", fontSize: small ? "11px" : "12px" }}>{name}</span>
      {hasInjury && <span style={styles.injuryDot} title="Key player out/doubtful">⚠</span>}
      {onInfo && <span onClick={(e) => { e.stopPropagation(); onInfo(name); }} style={{ ...styles.infoBtn, marginLeft: hasInjury ? "2px" : "auto" }} title="View team details">ℹ</span>}
    </div>
  );
}

function MatchupCard({ teamA, teamB, seedA, seedB, onPick, picked, roundLabel, onInfo }) {
  const result = teamA && teamB ? simulateMatchup(teamA, teamB) : null;
  const isUpset = result && TEAMS[result.winner]?.seed > TEAMS[result.loser]?.seed;
  return (
    <div style={styles.matchupCard}>
      <TeamPill name={teamA} seed={seedA} isWinner={picked === teamA} onClick={teamA ? () => onPick(teamA) : undefined} highlight={result?.winner === teamA && !picked} onInfo={onInfo} />
      <TeamPill name={teamB} seed={seedB} isWinner={picked === teamB} onClick={teamB ? () => onPick(teamB) : undefined} highlight={result?.winner === teamB && !picked} onInfo={onInfo} />
      {result && (
        <div style={styles.predictionBar}>
          <span style={{ color: isUpset ? "#fbbf24" : "#94a3b8", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
            {isUpset ? "🔥 " : ""}{result.winner} {result.winPct}% • {result.margin}pt
          </span>
        </div>
      )}
    </div>
  );
}

function RegionBracket({ region, bracketState, onPick, onInfo }) {
  const colors = REGION_COLORS[region];
  const matchups = BRACKET[region];
  const rounds = bracketState[region] || {};
  const r1 = rounds.r1 || {};
  const r2 = rounds.r2 || {};
  const r3 = rounds.r3 || {};
  const r4 = rounds.r4 || {};
  
  // Round of 64
  const r64Games = matchups.map((m, i) => ({
    teamA: m[0], teamB: m[1],
    seedA: TEAMS[m[0]]?.seed, seedB: TEAMS[m[1]]?.seed,
    picked: r1[i],
  }));

  // Round of 32
  const r32Games = [0, 1, 2, 3].map(i => ({
    teamA: r1[i * 2], teamB: r1[i * 2 + 1],
    seedA: r1[i * 2] ? TEAMS[r1[i * 2]]?.seed : null,
    seedB: r1[i * 2 + 1] ? TEAMS[r1[i * 2 + 1]]?.seed : null,
    picked: r2[i],
  }));

  // Sweet 16
  const s16Games = [0, 1].map(i => ({
    teamA: r2[i * 2], teamB: r2[i * 2 + 1],
    seedA: r2[i * 2] ? TEAMS[r2[i * 2]]?.seed : null,
    seedB: r2[i * 2 + 1] ? TEAMS[r2[i * 2 + 1]]?.seed : null,
    picked: r3[i],
  }));

  // Elite 8
  const e8Game = {
    teamA: r3[0], teamB: r3[1],
    seedA: r3[0] ? TEAMS[r3[0]]?.seed : null,
    seedB: r3[1] ? TEAMS[r3[1]]?.seed : null,
    picked: r4[0],
  };

  return (
    <div style={{ ...styles.regionContainer, borderColor: colors.accent }}>
      <div style={{ ...styles.regionHeader, background: `linear-gradient(135deg, ${colors.bg} 0%, #0a0a14 100%)`, borderBottom: `2px solid ${colors.accent}` }}>
        <span style={{ ...styles.regionTitle, color: colors.accent }}>{region} Region</span>
      </div>
      <div style={styles.bracketGrid}>
        <div style={styles.roundCol}>
          <div style={styles.roundLabel}>R64</div>
          {r64Games.map((g, i) => (
            <MatchupCard key={i} {...g} onPick={(team) => onPick(region, "r1", i, team)} onInfo={onInfo} />
          ))}
        </div>
        <div style={styles.roundCol}>
          <div style={styles.roundLabel}>R32</div>
          {r32Games.map((g, i) => (
            <MatchupCard key={i} {...g} onPick={(team) => onPick(region, "r2", i, team)} onInfo={onInfo} />
          ))}
        </div>
        <div style={styles.roundCol}>
          <div style={styles.roundLabel}>S16</div>
          {s16Games.map((g, i) => (
            <MatchupCard key={i} {...g} onPick={(team) => onPick(region, "r3", i, team)} onInfo={onInfo} />
          ))}
        </div>
        <div style={styles.roundCol}>
          <div style={styles.roundLabel}>E8</div>
          <MatchupCard {...e8Game} onPick={(team) => onPick(region, "r4", 0, team)} onInfo={onInfo} />
        </div>
      </div>
    </div>
  );
}

function TeamDetailModal({ teamName, onClose }) {
  const t = TEAMS[teamName];
  if (!t) return null;
  const power = computePowerScore(teamName).toFixed(1);
  const injPen = getInjuryPenalty(t).toFixed(1);
  const colors = REGION_COLORS[t.region];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2 style={{ margin: 0, color: "#f1f1f8", fontFamily: "'Outfit', sans-serif", fontSize: "22px" }}>
              <span style={{ ...styles.seedBadge, background: colors.accent, marginRight: "8px", fontSize: "14px" }}>{t.seed}</span>
              {teamName}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>{t.record} • {t.region} Region • KenPom #{t.kenpom}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.statGrid}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Power Score</div>
            <div style={{ ...styles.statValue, color: "#22c55e" }}>{power}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>AdjO Rank</div>
            <div style={styles.statValue}>#{t.adjO}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>AdjD Rank</div>
            <div style={styles.statValue}>#{t.adjD}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>AdjEM</div>
            <div style={styles.statValue}>{t.adjEM > 0 ? "+" : ""}{t.adjEM}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
          <div style={styles.profileBox}>
            <div style={styles.profileTitle}>Style Profile</div>
            <div style={styles.tagRow}>
              <span style={styles.tag}>{t.pace} pace</span>
              <span style={styles.tag}>{t.offIdentity}</span>
              <span style={styles.tag}>{t.defIdentity}</span>
              {t.trait && <span style={{ ...styles.tag, background: "#3b1f6e", color: "#c4b5fd" }}>{t.trait}</span>}
            </div>
          </div>
          <div style={styles.profileBox}>
            <div style={styles.profileTitle}>Momentum</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>{t.momentum === "hot" ? "🔥" : t.momentum === "cold" ? "🧊" : "➖"}</span>
              <span style={{ color: "#cbd5e1", fontSize: "12px" }}>{t.momentumDetail}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
          <div style={styles.fourFactorBox}>
            <div style={styles.ffTitle}>Offense</div>
            <div style={styles.ffRow}><span>eFG%</span><span>{t.efg}%</span></div>
            <div style={styles.ffRow}><span>TO%</span><span>{t.tov}%</span></div>
            <div style={styles.ffRow}><span>ORB%</span><span>{t.orb}%</span></div>
            <div style={styles.ffRow}><span>FT Rate</span><span>{t.ftr}%</span></div>
            <div style={styles.ffRow}><span>3PA Rate</span><span>{t.threePARate}%</span></div>
          </div>
          <div style={styles.fourFactorBox}>
            <div style={styles.ffTitle}>Defense</div>
            <div style={styles.ffRow}><span>Opp eFG%</span><span>{t.efgD}%</span></div>
            <div style={styles.ffRow}><span>Forced TO%</span><span>{t.tovD}%</span></div>
            <div style={styles.ffRow}><span>Def Reb%</span><span>{(100 - t.orbD).toFixed(1)}%</span></div>
            <div style={styles.ffRow}><span>Steal Rate</span><span>{t.stealRate}%</span></div>
            <div style={styles.ffRow}><span>Block Rate</span><span>{t.blockRate}%</span></div>
          </div>
        </div>

        {t.injuries.length > 0 && (
          <div style={{ ...styles.profileBox, marginTop: "12px", borderColor: "#dc2626" }}>
            <div style={{ ...styles.profileTitle, color: "#ef4444" }}>⚠ Injuries</div>
            {t.injuries.map((inj, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                <span style={{ color: "#f1f1f8", fontSize: "13px", fontWeight: 600 }}>{inj.player}</span>
                <span style={{ ...styles.tag, marginLeft: "6px", background: inj.status === "out" ? "#7f1d1d" : inj.status === "doubtful" ? "#78350f" : "#1e3a5f", color: inj.status === "out" ? "#fca5a5" : inj.status === "doubtful" ? "#fde68a" : "#93c5fd", fontSize: "10px" }}>{inj.status.toUpperCase()}</span>
                <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>{inj.detail} (Impact: -{(inj.impact * 100).toFixed(0)}%)</div>
              </div>
            ))}
            <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>Total Injury Penalty: -{injPen} pts</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FinalFour({ bracketState, onPick, onInfo }) {
  const eastWinner = bracketState.East?.r4?.[0];
  const westWinner = bracketState.West?.r4?.[0];
  const midwestWinner = bracketState.Midwest?.r4?.[0];
  const southWinner = bracketState.South?.r4?.[0];
  const ff = bracketState.finalFour || {};
  const champ = bracketState.championship;

  const semi1A = eastWinner;
  const semi1B = southWinner;
  const semi2A = westWinner;
  const semi2B = midwestWinner;

  return (
    <div style={styles.finalFourContainer}>
      <div style={styles.ffHeader}>
        <span style={styles.ffHeaderText}>FINAL FOUR</span>
        <span style={{ color: "#64748b", fontSize: "12px" }}>Lucas Oil Stadium • Indianapolis</span>
      </div>
      <div style={styles.ffGrid}>
        <div style={styles.ffSemi}>
          <div style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>East vs South</div>
          <MatchupCard
            teamA={semi1A} teamB={semi1B}
            seedA={semi1A ? TEAMS[semi1A]?.seed : null}
            seedB={semi1B ? TEAMS[semi1B]?.seed : null}
            picked={ff[0]}
            onPick={(team) => onPick("finalFour", "ff", 0, team)}
            onInfo={onInfo}
          />
        </div>
        <div style={styles.ffSemi}>
          <div style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>West vs Midwest</div>
          <MatchupCard
            teamA={semi2A} teamB={semi2B}
            seedA={semi2A ? TEAMS[semi2A]?.seed : null}
            seedB={semi2B ? TEAMS[semi2B]?.seed : null}
            picked={ff[1]}
            onPick={(team) => onPick("finalFour", "ff", 1, team)}
            onInfo={onInfo}
          />
        </div>
        <div style={styles.ffChamp}>
          <div style={{ color: "#fbbf24", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>🏆 National Championship</div>
          <MatchupCard
            teamA={ff[0]} teamB={ff[1]}
            seedA={ff[0] ? TEAMS[ff[0]]?.seed : null}
            seedB={ff[1] ? TEAMS[ff[1]]?.seed : null}
            picked={champ}
            onPick={(team) => onPick("championship", "champ", 0, team)}
            onInfo={onInfo}
          />
          {champ && (
            <div style={styles.championBanner}>
              <span style={{ fontSize: "28px" }}>🏆</span>
              <span style={{ color: "#fbbf24", fontSize: "18px", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{champ}</span>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>National Champions</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [bracketState, setBracketState] = useState({
    East: { r1: {}, r2: {}, r3: {}, r4: {} },
    West: { r1: {}, r2: {}, r3: {}, r4: {} },
    Midwest: { r1: {}, r2: {}, r3: {}, r4: {} },
    South: { r1: {}, r2: {}, r3: {}, r4: {} },
    finalFour: {},
    championship: null,
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeRegion, setActiveRegion] = useState("East");
  const [showFinalFour, setShowFinalFour] = useState(false);

  const clearDownstream = useCallback((state, region, round, index) => {
    const newState = JSON.parse(JSON.stringify(state));
    if (region === "finalFour" || region === "championship") return newState;
    const regionState = newState[region];
    const rounds = ["r1", "r2", "r3", "r4"];
    const rIdx = rounds.indexOf(round);
    for (let r = rIdx + 1; r < rounds.length; r++) {
      const nextRound = rounds[r];
      const feedsInto = Math.floor(index / 2);
      const checkIdx = r === rIdx + 1 ? feedsInto : Math.floor(feedsInto / Math.pow(2, r - rIdx - 1));
      if (regionState[nextRound]?.[checkIdx]) {
        delete regionState[nextRound][checkIdx];
      }
    }
    // Clear final four and championship if region winner changes
    if (newState.finalFour) {
      const ffIdx = region === "East" || region === "South" ? 0 : 1;
      if (round === "r4" || !regionState.r4?.[0]) {
        delete newState.finalFour[ffIdx];
        newState.championship = null;
      }
    }
    return newState;
  }, []);

  const handlePick = useCallback((region, round, index, team) => {
    if (region === "championship") {
      setBracketState(prev => ({ ...prev, championship: team }));
      return;
    }
    if (region === "finalFour") {
      setBracketState(prev => {
        const newState = { ...prev, finalFour: { ...prev.finalFour, [index]: team }, championship: null };
        return newState;
      });
      return;
    }
    setBracketState(prev => {
      let newState = clearDownstream(prev, region, round, index);
      newState[region][round][index] = team;
      return newState;
    });
  }, [clearDownstream]);

  const autoFill = useCallback(() => {
    const newState = {
      East: { r1: {}, r2: {}, r3: {}, r4: {} },
      West: { r1: {}, r2: {}, r3: {}, r4: {} },
      Midwest: { r1: {}, r2: {}, r3: {}, r4: {} },
      South: { r1: {}, r2: {}, r3: {}, r4: {} },
      finalFour: {},
      championship: null,
    };
    for (const region of Object.keys(BRACKET)) {
      // R64
      BRACKET[region].forEach((m, i) => {
        const result = simulateMatchup(m[0], m[1]);
        newState[region].r1[i] = result.winner;
      });
      // R32
      for (let i = 0; i < 4; i++) {
        const a = newState[region].r1[i * 2];
        const b = newState[region].r1[i * 2 + 1];
        if (a && b) newState[region].r2[i] = simulateMatchup(a, b).winner;
      }
      // S16
      for (let i = 0; i < 2; i++) {
        const a = newState[region].r2[i * 2];
        const b = newState[region].r2[i * 2 + 1];
        if (a && b) newState[region].r3[i] = simulateMatchup(a, b).winner;
      }
      // E8
      const a = newState[region].r3[0];
      const b = newState[region].r3[1];
      if (a && b) newState[region].r4[0] = simulateMatchup(a, b).winner;
    }
    // Final Four
    const e = newState.East.r4[0], s = newState.South.r4[0];
    const w = newState.West.r4[0], m = newState.Midwest.r4[0];
    if (e && s) newState.finalFour[0] = simulateMatchup(e, s).winner;
    if (w && m) newState.finalFour[1] = simulateMatchup(w, m).winner;
    if (newState.finalFour[0] && newState.finalFour[1])
      newState.championship = simulateMatchup(newState.finalFour[0], newState.finalFour[1]).winner;
    setBracketState(newState);
    setShowFinalFour(true);
  }, []);

  const totalPicks = useMemo(() => {
    let count = 0;
    for (const region of Object.keys(BRACKET)) {
      count += Object.keys(bracketState[region]?.r1 || {}).length;
      count += Object.keys(bracketState[region]?.r2 || {}).length;
      count += Object.keys(bracketState[region]?.r3 || {}).length;
      count += Object.keys(bracketState[region]?.r4 || {}).length;
    }
    count += Object.keys(bracketState.finalFour || {}).length;
    if (bracketState.championship) count++;
    return count;
  }, [bracketState]);

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.title}>MARCH MADNESS 2026</h1>
            <p style={styles.subtitle}>Bracket Predictor • Powered by KenPom + Style Matchups + Injuries</p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.pickCounter}>{totalPicks}/67 picks</div>
            <button onClick={autoFill} style={styles.autoFillBtn}>⚡ Auto-Fill (Model Picks)</button>
            <button onClick={() => setBracketState({ East: { r1: {}, r2: {}, r3: {}, r4: {} }, West: { r1: {}, r2: {}, r3: {}, r4: {} }, Midwest: { r1: {}, r2: {}, r3: {}, r4: {} }, South: { r1: {}, r2: {}, r3: {}, r4: {} }, finalFour: {}, championship: null })} style={styles.resetBtn}>↺ Reset</button>
          </div>
        </div>
      </header>

      <div style={styles.tabRow}>
        {Object.keys(BRACKET).map(region => (
          <button
            key={region}
            onClick={() => { setActiveRegion(region); setShowFinalFour(false); }}
            style={{
              ...styles.tab,
              background: activeRegion === region && !showFinalFour ? REGION_COLORS[region].bg : "transparent",
              color: activeRegion === region && !showFinalFour ? REGION_COLORS[region].accent : "#64748b",
              borderBottom: activeRegion === region && !showFinalFour ? `2px solid ${REGION_COLORS[region].accent}` : "2px solid transparent",
            }}
          >
            {region}
          </button>
        ))}
        <button
          onClick={() => setShowFinalFour(true)}
          style={{
            ...styles.tab,
            background: showFinalFour ? "#2a1a0a" : "transparent",
            color: showFinalFour ? "#fbbf24" : "#64748b",
            borderBottom: showFinalFour ? "2px solid #fbbf24" : "2px solid transparent",
          }}
        >
          🏆 Final Four
        </button>
      </div>

      <div style={styles.instructions}>
        <span style={{ color: "#94a3b8" }}>💡</span> Click a team to pick them as the winner. Click <span style={{ color: "#a5b4fc" }}>ℹ</span> to see detailed stats, injuries, and style profile. Highlighted teams are model-recommended.
      </div>

      <main style={styles.main}>
        {showFinalFour ? (
          <FinalFour bracketState={bracketState} onPick={handlePick} onInfo={setSelectedTeam} />
        ) : (
          <RegionBracket
            region={activeRegion}
            bracketState={bracketState}
            onPick={handlePick}
            onInfo={setSelectedTeam}
          />
        )}
      </main>

      <div style={styles.legend}>
        <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: "#22c55e" }}></span> Your Pick</span>
        <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: "#6366f1" }}></span> Model Recommends</span>
        <span style={styles.legendItem}><span style={{ fontSize: "12px" }}>⚠</span> Injury Alert</span>
        <span style={styles.legendItem}><span style={{ fontSize: "12px" }}>🔥</span> Upset Pick</span>
      </div>

      {selectedTeam && (
        <TeamDetailModal teamName={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  app: {
    fontFamily: "'Outfit', sans-serif",
    background: "linear-gradient(180deg, #08080f 0%, #0c0c1a 100%)",
    minHeight: "100vh",
    color: "#e2e2f0",
  },
  header: {
    background: "linear-gradient(135deg, #0a0a18 0%, #12122a 100%)",
    borderBottom: "1px solid #1a1a3e",
    padding: "16px 20px",
  },
  headerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "2px",
    background: "linear-gradient(135deg, #f1f1f8, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Outfit', sans-serif",
  },
  subtitle: {
    margin: "2px 0 0",
    color: "#64748b",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  pickCounter: {
    background: "#1a1a3e",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "'JetBrains Mono', monospace",
    color: "#a5b4fc",
  },
  autoFillBtn: {
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
  },
  resetBtn: {
    background: "#1a1a2e",
    color: "#94a3b8",
    border: "1px solid #2a2a3e",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Outfit', sans-serif",
  },
  tabRow: {
    display: "flex",
    gap: "0",
    borderBottom: "1px solid #1a1a3e",
    overflowX: "auto",
  },
  tab: {
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  instructions: {
    padding: "8px 20px",
    fontSize: "11px",
    color: "#64748b",
    background: "#0a0a14",
    borderBottom: "1px solid #1a1a2e",
  },
  main: {
    padding: "16px",
    overflowX: "auto",
  },
  regionContainer: {
    border: "1px solid #2a2a3e",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#0a0a14",
  },
  regionHeader: {
    padding: "12px 16px",
  },
  regionTitle: {
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  bracketGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "8px",
    padding: "12px",
    overflowX: "auto",
    minWidth: "600px",
  },
  roundCol: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    justifyContent: "space-around",
  },
  roundLabel: {
    textAlign: "center",
    fontSize: "10px",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "4px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  matchupCard: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginBottom: "4px",
  },
  teamPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 8px",
    borderRadius: "6px",
    transition: "all 0.15s",
    position: "relative",
  },
  teamPillSmall: {
    padding: "3px 6px",
  },
  seedBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#e2e2f0",
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
  },
  teamName: {
    fontSize: "12px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  injuryDot: {
    fontSize: "10px",
    marginLeft: "auto",
  },
  infoBtn: {
    fontSize: "10px",
    marginLeft: "auto",
    cursor: "pointer",
    opacity: 0.5,
    padding: "0 2px",
  },
  predictionBar: {
    padding: "2px 8px",
    textAlign: "center",
  },
  finalFourContainer: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  ffHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  ffHeaderText: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "4px",
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "block",
    fontFamily: "'Outfit', sans-serif",
  },
  ffGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  ffSemi: {
    background: "#0a0a14",
    border: "1px solid #2a2a3e",
    borderRadius: "12px",
    padding: "16px",
  },
  ffChamp: {
    background: "linear-gradient(135deg, #1a1408 0%, #0a0a14 100%)",
    border: "1px solid #fbbf24",
    borderRadius: "12px",
    padding: "20px",
  },
  championBanner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    marginTop: "16px",
    padding: "16px",
    background: "linear-gradient(135deg, #1a1408, #2a1a08)",
    borderRadius: "10px",
    border: "1px solid #fbbf24",
  },
  legend: {
    display: "flex",
    gap: "16px",
    padding: "12px 20px",
    borderTop: "1px solid #1a1a2e",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "#64748b",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#12121f",
    border: "1px solid #2a2a3e",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "550px",
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  closeBtn: {
    background: "none",
    border: "1px solid #2a2a3e",
    color: "#94a3b8",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  statBox: {
    background: "#1a1a2e",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
  },
  statLabel: {
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#e2e2f0",
    fontFamily: "'JetBrains Mono', monospace",
    marginTop: "2px",
  },
  profileBox: {
    background: "#1a1a2e",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2a2a3e",
  },
  profileTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#a5b4fc",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  tag: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 600,
    background: "#1e293b",
    color: "#94a3b8",
  },
  fourFactorBox: {
    background: "#1a1a2e",
    padding: "10px",
    borderRadius: "8px",
  },
  ffTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#a5b4fc",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  ffRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#cbd5e1",
    padding: "2px 0",
    fontFamily: "'JetBrains Mono', monospace",
  },
};
