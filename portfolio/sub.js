// 오디오 요소 생성
var audio = new Audio('./data/beat.mp3');

// 재생 버튼 클릭 시
document.getElementById('play_button').addEventListener('click', function() {
    audio.play();
});

// 일시 정지 버튼 클릭 시
document.getElementById('pause_button').addEventListener('click', function() {
    audio.pause();
});

// 정지 버튼 클릭 시
document.getElementById('stop_button').addEventListener('click', function() {
    audio.pause();
    audio.currentTime = 0;
});