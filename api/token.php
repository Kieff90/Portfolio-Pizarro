<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://pedropizarrodiaz.it');

$config = @include __DIR__ . '/deepgram.conf.php';
$key = (is_array($config) && isset($config['key'])) ? $config['key'] : '';

if (!$key) {
    http_response_code(503);
    echo json_encode(['error' => 'Service unavailable']);
    exit;
}

$ctx = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Authorization: Token $key\r\nContent-Type: application/json\r\n",
        'content' => '{}',
        'timeout' => 5,
    ]
]);

$response = @file_get_contents('https://api.deepgram.com/v1/auth/grant', false, $ctx);

if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Token service unavailable']);
    exit;
}

echo $response;
