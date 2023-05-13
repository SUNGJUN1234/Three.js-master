
const progressbar = document.getElementById("progressbar");
const progress_h1 = document.getElementById("progress_h1");
const start_button_div = document.getElementById("start_button_div");
const play_button = document.getElementById("play_button");



        // 오디오 요소 생성
        var audio = new Audio('./data/beat.mp3');
        
        // 재생 버튼 클릭 시
        play_button.addEventListener('click', function() {
            audio.play();
            play_button.style.backgroundColor ="black";
            play_button.style.color ="white";
            setTimeout(() => {
                start_button_div.style.opacity ="0";

          }, 1000);

          setTimeout(() => {
            start_button_div.style.display ="none";
            window.wheelEnabled = true;
          }, 5000);

        });



        if (window.scene_num == 0) {
          
        } else if (window.scene_num == 1) {
            container1.style.opacity = 1;
        }else if (window.scene_num == 2) {
            
        }else if (window.scene_num == 3) {
            
        }else if (window.scene_num == 4) {
            
        }

        // // 일시 정지 버튼 클릭 시
        // document.getElementById('pause_button').addEventListener('click', function() {
        //     audio.pause();
        //     console.log(scene_num)
        // });
        
        // // 정지 버튼 클릭 시
        // document.getElementById('stop_button').addEventListener('click', function() {
        //     audio.pause();
        //     audio.currentTime = 0;
        // });


