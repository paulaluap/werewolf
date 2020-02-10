# werwolf spiel :)

1. die spieler erstellen eine normale gruppe, die `DORFGRUPPE`
   bot@werewolf wird hinzugefügt
   bot erkennt `ANZAHL_SPIELER`
2. bot schlägt anzahl werwölfe und bürger vor


    "Hallo, ich werde mit euch in die finstere Welt der grausamen 
	Werwölfe eintauchen.
	
	Zu dieser Stunde befinden sich zwei Werwölfe unter euch, 
	die die 5 Bürger töten wollen.
	
	Jeden Moment erfahrt ihr, wer ihr seid!"

3. bot schreibt jeden einzelnen spieler an und teilt ihm mit,
   ob er ein werwolf oder ein bürger ist und gibt weitere notwendige anweisungen:
   TODO
   [dieser schritt ist derzeit nicht unbedingt notwendig,
   bereitet den flow aber auf weitere charactere wie hexe, seherIn etc. vor]

4. gleichzeitig wird eine `WERWOLFGRUPPE` mit allen werwölfen angelegt

5. zurück in der `DORFGRUPPE`

     "Das Dorf schläft unruhig ein während die Werwölfe sich ein Opfer suchen."

   [falls vor dem morgen in der Gruppe gechattet wird,
   antwortet der Bot mit "Psst!"|"Schlaf weiter"|etc]
  
6. in der `WERWOLFGRUPPE`:

   "Ihr seid die ausgewählten werwölfe und sollt euch jetzt einigen, 
   wer das erste|nächste Opfer sein soll.
   Wenn ihr zu einem Ergebnis gekommen seid, schreibt 
   @bot kill <Opfername>
   in diesen Chat."

   - die Werwölfe diskutieren

   [wenn nach N minuten noch kein ergebnis verkündet wurde, 
   kann der bot drängeln, etwa "beeilt euch, der morgen naht!"]

7. zurück in der `DORFGRUPPE`:

   - der bot verkündet, wer das Opfer ist.    

     "Diese Nacht wurde leider `OPFERNAME` von den werwölfen brutal umgebracht.
 	 Habt ihr irgendwelche Anklagen?
	 Wer glaubt ihr ist einer von den N werwölfen? Teilt mir das Ergbnis mit
	 @bot kill <Name> mit."

   - die spieler diskutieren ...

   - wenn das Ergebnis verkündet wurde, sagt der Bot:
   
     "Ihr habt euch entschieden, <Name> zu töten..."
     [kleine dramatische Pause]
	 - falls <Name> bürger war: 
	     "... die Bürgen weinen, denn <Name> war einer von euch 
	     und ihr habt es den Werwölfen nur noch leichter gemacht."
	 - falls <Name> tatsächlich werwolf war:
	     "... das war eine gut entscheidung! 
		 nun sind es nur noch N werwölfe."

     wenn (werwölfe	<>0 UND bürger<>0) gehe zu 5.
	 wenn (werwöfe<>0 UND bürger=0)
	    "die werwölfe haben gewonnen" gehe zu 8.
     wenn (bürger<>0 und werwölfe=0)
	    "die bürger haben gewonnen.
		ihr habt euer dorf gerettet!" gehe zu 8.

8. wenn ihr noch einmal spielen wollt, sendet 
   @bot play
