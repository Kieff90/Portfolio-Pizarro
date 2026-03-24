<?php
header('Content-Type: application/json');

$config = @include __DIR__ . '/deepgram.conf.php';
$key = (is_array($config) && isset($config['key'])) ? $config['key'] : '';

if (!$key) {
    http_response_code(503);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

echo json_encode(['access_token' => $key]);
