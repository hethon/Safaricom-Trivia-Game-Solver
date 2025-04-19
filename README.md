Example request:

```
curl -X POST http://localhost:3000/question \
  -H "Content-Type: application/json" \
  -d '{"question": "Which of the following is used to show directions on a map?\nA. Thermometer\nB. Windvane\nC. Compass"}'
```

Example output:
```
{
  "stem": "What is the capital of France?",
  "choices": [
    { "letter": "A", "text": "Berlin" },
    { "letter": "B", "text": "Madrid" },
    { "letter": "C", "text": "Paris" },
    { "letter": "D", "text": "Rome" }
  ],
  "correctChoice": "Paris",
  "correctLetter": "C"
}
```
