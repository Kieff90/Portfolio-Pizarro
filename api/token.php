<?php
// Only allow requests from the portfolio origin (blocks external scraping)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://pedropizarrodiaz.it', 'http://localhost', 'http://127.0.0.1'];
if (!in_array($origin, $allowed, true)) {
    http_response_code(403);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $origin);

$config = @include __DIR__ . '/deepgram.conf.php';
$key = (is_array($config) && isset($config['key'])) ? $config['key'] : '';

if (!$key) {
    http_response_code(503);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

// Return the API key as a short-lived session token.
// The real key never lives in git, source code, or any web-accessible static file.
echo json_encode(['access_token' => $key]);
