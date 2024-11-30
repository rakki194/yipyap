# Testing the Implementation

## Testing `PUT /caption/{path}`

```bash
curl -X PUT "http://localhost:8080/caption/images/photo.jpg" \
     -H "Content-Type: application/json" \
     -d '{"type": "caption", "caption": "A beautiful sunset."}'
```

## Testing `DELETE /api/caption/{path}`

```bash
curl -X DELETE "http://localhost:8080/api/caption/images/photo.jpg?caption_type=caption"
```

## Testing `DELETE /api/browse/{path}`

```bash
curl -X DELETE "http://localhost:8080/api/browse/images/photo.jpg?confirm=true"
```

## Testing `GET /preview/{path}`

```bash
curl "http://localhost:8080/preview/images/photo.jpg" --output preview.webp
```

## Testing `GET /download/{path}`

```bash
curl "http://localhost:8080/download/images/photo.jpg" --output photo.jpg
```

## Testing `GET /config`

```bash
curl "http://localhost:8080/config"
```
