# PDF bracket structures

Source directory: `/mnt/c/Users/waldo/OneDrive/Documents/DARTS/brackets/`

Extraction used Poppler `pdftotext -bbox-layout` plus Poppler rendering for connector geometry. These PDFs are generated documents with selectable text, so OCR was not needed. Match labels are listed by visual columns from left to right. Within a column, labels are top to bottom. `G` means game/match number from the PDF. `Lx` means loser of game `x` enters at that printed slot. Play-in matches are included when the early winner column feeds into the next winner column. The last game is the reset final and receives `L(first final) if first loss`.

| Teams | PDF | Winner bracket columns | Loser bracket columns | Final / reset |
| --- | --- | --- | --- | --- |
| 3 | `3teamdouble.pdf` | `G1` / `G2` / `G4` | `G3` / `G5` | `G4`, reset `G5` from `L4` |
| 4 | `4teamDouble.pdf` | `G1,G2` / `G3` / `G6` | `G4` / `G5` / `G7` | `G6`, reset `G7` from `L6` |
| 5 | `5teamDouble.pdf` | `G1` / `G2,G3` / `G5` / `G8` | `G4` / `G6` / `G7` / `G9` | `G8`, reset `G9` from `L8` |
| 6 | `6teamDouble.pdf` | `G1,G2` / `G3,G4` / `G7` / `G10` | `G5,G6` / `G8` / `G9` / `G11` | `G10`, reset `G11` from `L10` |
| 7 | `7teamDouble.pdf` | `G1,G2,G3` / `G4,G5` / `G9` / `G12` | `G6` / `G8,G7` / `G10` / `G11` / `G13` | `G12`, reset `G13` from `L12` |
| 8 | `8teamDouble.pdf` | `G1,G2,G3,G4` / `G7,G8` / `G11` / `G14` | `G5,G6` / `G9,G10` / `G12` / `G13` / `G15` | `G14`, reset `G15` from `L14` |
| 9 | `9teamdouble.pdf` | `G1` / `G2,G3,G5,G4` / `G9,G10` / `G13` / `G16` | `G6` / `G8,G7` / `G12,G11` / `G14` / `G15` / `G17` | `G16`, reset `G17` from `L16` |
| 10 | `10teamDouble.pdf` | `G1,G2` / `G3,G5,G6,G4` / `G11,G12` / `G15` / `G18` | `G7,G8` / `G9,G10` / `G13,G14` / `G16` / `G17` / `G19` | `G18`, reset `G19` from `L18` |
| 11 | `11teamdouble.pdf` | `G1,G2,G3` / `G4,G5,G6,G7` / `G13,G14` / `G17` / `G20` | `G8,G9,G10` / `G11,G12` / `G16,G15` / `G18` / `G19` / `G21` | `G20`, reset `G21` from `L20` |
| 12 | `12teamdouble.pdf` | `G1,G2,G3,G4` / `G5,G6,G7,G8` / `G13,G14` / `G19` / `G22` | `G9,G10,G11,G12` / `G15,G16` / `G17,G18` / `G20` / `G21` / `G23` | `G22`, reset `G23` from `L22` |
| 13 | `13teamdouble.pdf` | `G1,G2,G3,G4,G5` / `G6,G7,G9,G8` / `G15,G16` / `G21` / `G24` | `G10` / `G14,G11,G12,G13` / `G17,G18` / `G19,G20` / `G22` / `G23` / `G25` | `G24`, reset `G25` from `L24` |
| 14 | `14teamdouble.pdf` | `G1,G2,G3,G4,G5,G6` / `G7,G8,G9,G10` / `G17,G18` / `G23` / `G26` | `G11,G12` / `G15,G13,G14,G16` / `G19,G20` / `G21,G22` / `G24` / `G25` / `G27` | `G26`, reset `G27` from `L26` |
| 15 | `15teamdouble.pdf` | `G1,G2,G3,G4,G5,G6,G7` / `G8,G9,G10,G11` / `G19,G20` / `G25` / `G28` | `G12,G13,G14` / `G16,G17,G15,G18` / `G21,G22` / `G23,G24` / `G26` / `G27` / `G29` | `G28`, reset `G29` from `L28` |
| 16 | `16teamdouble.pdf` | `G1,G2,G3,G4,G5,G6,G7,G8` / `G13,G14,G15,G16` / `G21,G22` / `G27` / `G30` | `G9,G10,G11,G12` / `G17,G18,G19,G20` / `G23,G24` / `G25,G26` / `G28` / `G29` / `G31` | `G30`, reset `G31` from `L30` |
| 17 | `17-team-double.pdf` | `G1` / `G9,G2,G3,G4,G5,G6,G7,G8` / `G15,G16,G17,G18` / `G23,G24` / `G29` / `G32` | `G10` / `G14,G11,G12,G13` / `G19,G20,G21,G22` / `G25,G26` / `G27,G28` / `G30` / `G31` / `G33` | `G32`, reset `G33` from `L32` |
| 18 | `18-team-double.pdf` | `G1,G2` / `G9,G3,G4,G5,G10,G6,G7,G8` / `G17,G18,G19,G20` / `G25,G26` / `G31` / `G34` | `G11,G12` / `G15,G13,G16,G14` / `G21,G22,G23,G24` / `G27,G28` / `G29,G30` / `G32` / `G33` / `G35` | `G34`, reset `G35` from `L34` |
| 19 | `19-team-double.pdf` | `G1,G2,G3` / `G9,G4,G5,G6,G10,G7,G11,G8` / `G19,G20,G21,G22` / `G27,G28` / `G33` / `G36` | `G12,G13,G14` / `G16,G15,G17,G18` / `G23,G24,G25,G26` / `G29,G30` / `G31,G32` / `G34` / `G35` / `G37` | `G36`, reset `G37` from `L36` |
| 20 | `20-team-double.pdf` | `G1,G2,G3,G4` / `G9,G5,G10,G6,G11,G7,G12,G8` / `G21,G22,G23,G24` / `G29,G30` / `G35` / `G38` | `G13,G14,G15,G16` / `G17,G18,G19,G20` / `G25,G26,G27,G28` / `G31,G32` / `G33,G34` / `G36` / `G37` / `G39` | `G38`, reset `G39` from `L38` |
| 21 | `21-team-double.pdf` | `G1,G2,G3,G4,G5` / `G9,G6,G10,G11,G12,G7,G13,G8` / `G23,G24,G25,G26` / `G31,G32` / `G37` / `G40` | `G14,G15,G16,G17,G18` / `G19,G22,G20,G21` / `G27,G28,G29,G30` / `G33,G34` / `G35,G36` / `G38` / `G39` / `G41` | `G40`, reset `G41` from `L40` |
| 22 | `22teamdouble.pdf` | `G1,G2,G3,G4,G5,G6` / `G9,G7,G10,G11,G12,G8,G13,G14` / `G25,G26,G27,G28` / `G33,G34` / `G39` / `G42` | `G15,G16,G17,G18,G19,G20` / `G21,G23,G22,G24` / `G29,G30,G31,G32` / `G35,G36` / `G37,G38` / `G40` / `G41` / `G43` | `G42`, reset `G43` from `L42` |
| 23 | `23teamdouble.pdf` | `G1,G2,G3,G4,G5,G6,G7` / `G9,G8,G10,G11,G12,G13,G14,G15` / `G27,G28,G29,G30` / `G35,G36` / `G41` / `G44` | `G16,G17,G18,G19,G20,G21,G22` / `G23,G24,G25,G26` / `G31,G32,G33,G34` / `G37,G38` / `G39,G40` / `G42` / `G43` / `G45` | `G44`, reset `G45` from `L44` |
| 24 | `24teamdouble.pdf` | `G1,G2,G3,G4,G5,G6,G7,G8` / `G9,G10,G11,G12,G13,G14,G15,G16` / `G29,G30,G31,G32` / `G37,G38` / `G43` / `G46` | `G17,G18,G19,G20,G21,G22,G23,G24` / `G25,G26,G27,G28` / `G33,G34,G35,G36` / `G39,G40` / `G41,G42` / `G44` / `G45` / `G47` | `G46`, reset `G47` from `L46` |

## Notes

- Every PDF is a double-elimination bracket with a possible reset final. Total printed games are `2 * teams - 1`.
- The first final is always `G(2 * teams - 2)`. The reset final is always `G(2 * teams - 1)`.
- Winner bracket game numbering is not purely round-contiguous for non-power-of-two brackets. The PDFs reserve early numbers for play-in/main winner games, then interleave loser bracket games before later winner rounds.
- The columns above are the safest source of truth for matching the PrintYourBrackets layout and game numbering.
- Full learned match graphs, including winner routes, loser drops, play-ins, first final, and reset final inputs, are stored in `PDF_BRACKET_GRAPHS.json`.
