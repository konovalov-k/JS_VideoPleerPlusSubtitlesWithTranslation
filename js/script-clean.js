//Yandex translation start

function get_translation(text) {
	yandex_translate(text);
}

function yandex_translate(text) {
	text = text.replace(" ", ",");
	$.each(["'s", "n't", "'m", "'re", "'ll", "'ve", "'d"], function(i, val) {
		text = text.replace(val, "")
	});
		$.ajax({
		type: "POST",
		url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru&key=trnsl.1.1.20170205T082217Z.e9de139d8939cd86.0ec4523d349890c4552a732d293cff2e8e5f6e70&text=' + text,
		success: function(data) {
			var data = data.text[0];
			process_ya_reply(data, text);
		},});

}

function process_ya_reply(data, text) {
	var engText = text;
	var res = "";
	if (data.length == 0) {
		res = '<p class="eng">' + text.replace(",", " ") + '</p><p class="notfound">�������� ����� �� �������</p>'
	};
	if (data.length > 0) {
		//res += '<a class="btn btn-small btn-success" id="yandex_btn" onclick="hide_urban();">Yandex</a>';
		// res += '<a class="btn btn-small btn-success" id="urban_btn" onclick="hide_yandex();">Urban</a>';
		//res += '<a href="#urban-data" class="btn btn-small btn-success" id="urban_btn" onclick="hide_yandex();">Urban</a>';
		res += '<div class="yandex-data">';
		res += '<p class="eng">' + engText + "</p>";
		res += '<p class="ru">' + data + "</p>";
		res += '</div>';
		res += '<div class="urban-data"></div>';
	};
	show_translation_yandex(res, data, engText);
}

function show_translation_yandex(text, data, engText) {
	var tr_obj = $(".translation");
	var sub_obj = $(".fp-subtitle");
	var sub_wrap = $(".fp-subtitle-wrap");
	var header = "";
	var old = $("#words_list").html();
	var left = ($(".myplayer").width() - tr_obj.outerWidth()) / 2;

	$("#words_list").html(old + engText + ":"+ data+ "; ");
	tr_obj.css({
		// bottom: sub_obj.height() + parseFloat(sub_obj.css("bottom")),
		"max-height": ($(".myplayer").height() - sub_obj.outerHeight() - sub_wrap.height() - parseInt(sub_wrap.css("bottom")) - 2 * parseInt(tr_obj.css("padding-top")) - 2 * parseInt(tr_obj.css("border-top-width"))).toString() + "px",
		"bottom": $(".fp-subtitle").height() + 10,
		"left": left
	});
	tr_obj.html(header + text);
	
	tr_obj.show();
	
	//���������� � ������
	new_words_eng.push(engText);
	new_words_ru.push(data);
}
//Yandex translation stop

function urban_translate(text) {
	text = text.replace(" ", ",");
	$.each(["'s", "n't", "'m", "'re", "'ll", "'ve", "'d"], function(i, val) {
		text = text.replace(val, "")
	});
		$.ajax({
		type: "GET",
		dataType: "json",
		url: 'http://api.urbandictionary.com/v0/define?term=' + text,
		success: function(data) {
			process_urban_reply(data, text);
		},});

}

function process_urban_reply(data, text) {
	var sum = "";
	var tags_length = data.tags.length;
	var tags_data = data.tags;
	var list_data_length = data.list.length;
	if (data.tags.length == 0) {
		res = '<p class="eng">' + text.replace(",", " ") + '</p><p class="notfound">�������� ����� �� �������</p>'
	};
	for (var i = 0; i < tags_length; i++) {
		old_sum = sum;
		var tags = tags_data[i];
		sum = old_sum + tags + " ";
	}
	tags_title = '<p class="eng">' + "Words:" + "</p>";
	tags_res = '<div class="tags">'+ tags_title +'<p class="ru">' + sum + "</p>" + "</div>";
	sum = "";
	for (var i = 0; i < list_data_length; i++) {
		old_sum = sum;
		var definition = data.list[i].definition;
		sum = old_sum + '<p class="ru">' + definition + "</p>";
	}
	definition_title = '<p class="eng">' + "Definitions:" + "</p>";
	definition_res = '<div class="definition">' + definition_title + sum + "</div>";
	sum = "";
		for (var i = 0; i < list_data_length; i++) {
		var example = data.list[i].example;
		sum = old_sum + '<p class="ru">' + example + "</p>";
	}
	example_title = '<p class="eng">' + "Example:" + "</p>";
	example_res = '<div class="example">' + example_title + sum + "</div>";
	show_translation_urban (tags_res,definition_res,example_res);
}

function show_translation_urban (tags,example,definition){
	// $(".urban-data").html(tags + example + definition);
	$("#urban-data").html(tags + example + definition);
}

function calculate_base_fontsize() {
	var fullscreen_fontsize = 42 / 1080 * screen.height;
	flowplayer.conf.base_fontsize = fullscreen_fontsize * ($(".myplayer").height() / screen.height)
}

function change_font_size_absolute(selector, factor) {
	var new_size = (parseFloat(flowplayer.conf.base_fontsize) * factor).toString() + "px";
	$(selector).css("font-size", new_size)
}

function change_font_size_relative(selector, factor) {
	var size = $(selector).css("font-size");
	var new_size = (parseFloat(size) * factor).toString() + "px";
	$(selector).css("font-size", new_size)
}

function resize_subtitle_wrap(factor) {
	var h = $(".fp-subtitle-wrap").height();
	var b = parseFloat($(".fp-subtitle").css("bottom"));
	$(".fp-subtitle-wrap").height(h * factor);
	$(".fp-subtitle").css("bottom", (b * factor).toString() + "px")
}

function shift_subtitles(time) { 
	var player_obj = flowplayer(".myplayer");
	var shift = time - flowplayer.conf.subtitles_shift;
	if (shift == 0) {
		return
	}

	function set_time(obj, prop, time) {
		obj[prop] += time
	}
	for (var i = 0; i < player_obj.cuepoints.length; i += 2) {
		set_time(player_obj.cuepoints[i], "time", shift);
		set_time(player_obj.cuepoints[i].subtitle, "startTime", shift);
		set_time(player_obj.cuepoints[i].subtitle, "endTime", shift);
		set_time(player_obj.cuepoints[i + 1], "time", shift)
	}
	flowplayer.conf.subtitles_shift += shift
}

function change_subs_opacity(step) {
	var obj = $(".fp-subtitle"),
		opacity = parseFloat($(".fp-subtitle").css("background-color").split(",")[3]);
	if (isNaN(opacity)) opacity = 1;
	var new_opacity = opacity + step;
	new_opacity = new_opacity < 0 ? 0 : new_opacity > 1 ? 1 : new_opacity;
	obj.css({
		"background-color": "rgba(0,0,0," + new_opacity.toString() + ")"
	})
}

function change_subs_position(step) {
	var obj = $(".fp-subtitle"),
		wrap_obj = $(".fp-subtitle-wrap");
	bottom = parseFloat(obj.css("bottom")), new_bottom = bottom + step, max_bottom = parseInt($(".myplayer").height() / 4);
	new_bottom = new_bottom < 0 ? 0 : new_bottom > max_bottom ? max_bottom : new_bottom;
	wrap_obj.height(new_bottom);
	obj.css("bottom", new_bottom + "px")
}

function init_player_ui() {
	$("#ui_subtitles_shift input").change(function() {
		val = parseFloat($(this).val());
		if (isNaN(val)) {
			val = 0
		}
		$(this).val(val + "sec");
		shift_subtitles(val)
	});
	$("#ui_subtitles_font input").change(function() {
		val = parseFloat($(this).val());
		if (!val) {
			return
		}
		$(this).val(val + "%");
		change_font_size_absolute(".fp-subtitle", val / 100)
	});
	$("#ui_subtitles_opacity a").click(function(e) {
		e.preventDefault();
		var step = .1;
		if ($(this).hasClass("ui_less")) step = -step;
		change_subs_opacity(step)
	});
	$("#ui_translation_font input").change(function() {
		val = parseFloat($(this).val());
		if (!val) {
			return
		}
		$(this).val(val + "%");
		change_font_size_absolute(".translation", val / 100)
	});
	$("#ui_subtitles_shift a").click(function(e) {
		e.preventDefault();
		var interval = 1;
		if ($(this).hasClass("ui_less")) {
			interval = -interval
		}
		var res = parseFloat($("#ui_subtitles_shift input").val());
		res += interval;
		$("#ui_subtitles_shift input").val(res.toString() + "sec");
		$("#ui_subtitles_shift input").trigger("change")
	});
	$("#ui_translation_font a, #ui_subtitles_font a").click(function(e) {
		e.preventDefault();
		var step = 10;
		var parent = $(this).parent();
		if ($(this).hasClass("ui_less")) {
			step = -step
		}
		var input = parent.find("input");
		var res = parseInt(input.val()) + step;
		input.val(res.toString() + "%");
		input.trigger("change")
	});
	$("#ui_subtitles_presence select").change(function(e) {
		var player_class = $(this).val();
		var $player = $(".flowplayer");
		$.each(["always_subs", "paused_subs", "no_subs"], function(i, c) {
			$player.removeClass(c)
		});
		$player.addClass(player_class);
		dump($player)
	});
	$("#ui_subtitles_position a").click(function(e) {
		e.preventDefault();
		var step = 5;
		if ($(this).hasClass("ui_less")) step = -step;
		change_subs_position(step)
	});
	$("#player_ui_wrapper").hide()
}

function stop_upload(error, message) {
	var result = "",
		alert_class;
	if (!error) {
		alert_class = "alert alert-success";
		result = "���� �������� �������!";
		$("#subs_url").html(message)
	} else {
		alert_class = "alert alert-error";
		var error_str = "";
		error_str = message;
		result = "��������� ������ �� ����� �������� �����! (" + error_str + ")"
	}
	$("#subs_upload_process").hide();
	$("#subs_upload_form").show();
	$("#subs_upload_result").removeClass("alert-error alert-success").addClass(alert_class).show();
	$("#subs_upload_result").html(result);
	window.setTimeout(function() {
		$("#subs_upload_result").slideUp(500)
	}, error ? 5e3 : 1e3)
}

function check_video_type() {
	if ($("input[name=video_src]").val() !== "") {
		video_attrs.video_src = $("input[name=video_src]").val();
		video_attrs.subs_url = $("input[name=subs_url]").val();
		return true
	}
	else {
		return false
	}
}

function generate_player_code(video_src,video_type, subs_url) {
	var res = '<div class="myplayer is-splash play-white">' + "\n";
	res += "<video>\n" + '<source src="' + video_src + '" type="video/mp4" />' + "\n";
	res += '<track src="' + subs_url + '"/>' + "\n";
	res += "</video>";
	res += "</div><!--myplayer-->\n";
	res += '<div id="player_ui_wrapper">';
	res += '<div id="player_ui_border">';
	res += '<div class="player_ui" id="ui_subtitles_shift">';
	res += '<p>�������� ���������</p>';
	res += '<div class="input-prepend input-append">';
	res += '<a class="ui_less btn" href="#"><i class="icon-arrow-left"></i></a>';
	res += '<input type="text" class="input-mini text-center" size="6" value="0sec">';
	res += '<a class="ui_more btn" href="#"><i class="icon-arrow-right"></i></a>';
	res += '</div></div> <!-- player_ui_wrapper -->';
	res += '<div class="player_ui" id="ui_subtitles_font">';
	res += '<p>������ ������ ���������</p>';
	res += '<div class="input-prepend input-append">';
	res += '<a class="ui_less btn" href="#"><i class="icon-minus"></i></a>';
	res += '<input type="text" class="input-mini text-center" size="4" value="100%">';
	res += '<a class="ui_more btn" href="#"><i class="icon-plus"></i></a>';
	res += '</div></div>';
	res += '<div class="player_ui" id="ui_subtitles_position"><p>���������</p><div class="input-prepend input-append"><a class="ui_less btn" href="#"><i class="icon-arrow-down"></i></a><a class="ui_more btn" href="#"><i class="icon-arrow-up"></i></a></div></div>';
	res += '<div class="player_ui" id="ui_subtitles_opacity"><p>������������</p><div class="input-prepend input-append"><a class="ui_less btn" href="#"><i class="icon-minus"></i></a><a class="ui_more btn" href="#"><i class="icon-plus"></i></a></div></div>';
	res += '<div class="player_ui" id="ui_subtitles_presence"><p>���������� ��������</p><select><option value="always_subs" selected>������</option><option value="paused_subs">��� �����</option><option value="no_subs">��� ���������</option></select></div>';
	res += '<div></div>';
	res += '</div></div> <!-- player_ui_wrapper -->';

	return res
}

function generate_alert(obj, type, message, timeout) {
	obj.hide();
	obj[0].className = "alert alert-" + type;
	obj.text(message);
	obj.slideDown();
	if (typeof timeout === "undefined") timeout = 3e3;
	if (timeout) {
		setTimeout(function() {
			obj.slideUp()
		}, timeout)
	}
}

function print_new_words() {
	var str_en = Object.keys(new_words).join(", ");
	var str_ru = Object.keys(new_words).join(", ");
	//$("#tab_new_words p").html(str_en ? str_en : "������ ����.");
	if (!$.isEmptyObject(new_words)) {
		$("#clear_new_words").show();
		$("#copy_words").show();
	}
	
}

function hide_urban(){
	$(".urban-data").hide();
	$(".translation").css("max-width","15%");
	$(".yandex-data").show();
	//$(".translation").css("left","");
	$("#urban-data").hide();
};
		
function hide_yandex(){
	urban_translate(text);
	$(".yandex-data").hide();
	$(".translation").css("max-width","70%");
	$("#urban-data").show();
	$(".urban-data").show();
};

$(document).ready(function() {
	
	$("#subs_upload_submit").click(function(event) {
		$("#subs_upload_process").show()
	});
	$("input[name=subs_file]").change(function() {
		if (this.files[0].size > 4e5) {
			stop_upload(1, "������� ������� ����. ������������ ������ &mdash; 400 ��");
			return
		}
		var src = window.URL.createObjectURL(this.files[0]);
		$("input[name=subs_file]").val(src);
	});
	$("input[name=local_video]").change(function() {
		var src = window.URL.createObjectURL(this.files[0]);
		$("input[name=video_src]").val(src)
	});
	$("input[name=video_src]").change(function() {
		video_attrs = {}
	});
	$("#submit-btn").click(function(event) {
		event.preventDefault();
		if (flowplayer()) {
			flowplayer().unload();
			$(".myplayer").remove();
			$("#player_ui_wrapper").hide()
		}
		if (check_video_type() == false) {
			return
		}
		$("#form_wrapper").css("display", "none");
		$("#btnChangeVideo").css("display", "block");
		video_attrs.video_type = "mp4";
		if ($("input[name=video_src]").val() !== "") {
			video_attrs.video_src = $("input[name=video_src]").val();
			video_attrs.subs_url = $("input[name=subs_file]").val();
		}
		if ($("input[name=video_src]").val() === "") {
			video_attrs.video_src = $("input[name=local_video_mobile]").val();
			video_attrs.subs_url = $("input[name=subs_file_mobile]").val();
		}
		$player_wrapper = $("#player_wrapper");
		$player_wrapper.html(generate_player_code(video_attrs.video_src, video_attrs.video_type, video_attrs.subs_url));
		init_player_ui();
		$('.fp-ui').click(function(event) {
			var trueWhite = $('.container').hasClass('containerBecomeWhite');
			if (trueWhite === true) {
				$('.container').removeClass('containerBecomeWhite');
				$('.container').addClass('containerBecomeBlack');
				console.log('black');
			}
			if (trueWhite === false) {
				$('.container').removeClass('containerBecomeBlack');
				$('.container').addClass('containerBecomeWhite');
				console.log('white');;
			}
		});
		if ($player_wrapper.hasClass("flash")) {
			$(".myplayer").flowplayer({
				engine: "flash"
			})
		} else if ($player_wrapper.hasClass("native")) {
			$video = $("video");
			$video.attr("controls", true);
			$video.css("width", "100%");
			return
		} else {
			$(".myplayer").flowplayer({})
		}
		calculate_base_fontsize();
		flowplayer.conf.subtitles_shift = 0;
$("#player_ui_wrapper").slideDown(); 
		$("#player_widgets").slideDown();
		$("#ui_translation_font input").trigger("change");
		$("#ui_subtitles_font input").trigger("change");
		$("#player_wrapper").css('margin', '0 auto');
		$(".fp-fullscreen").click(function(event) {
			$(".fp-engine").css('max-height', '100%');
			$(".fp-engine").css('top', '-30px');
		});
	});
	$("#submit-btn-2").click(function(event) {
		event.preventDefault();
		if (flowplayer()) {
			flowplayer().unload();
			$(".myplayer").remove();
			$("#player_ui_wrapper").hide()
		}
		if (check_video_type() == false) {
			return
		}
		$("#form_wrapper").hide();
		$("#btnChangeVideo-2").css("display", "block");
		video_attrs.video_type = "mp4";
		if ($("input[name=video_src]").val() !== "") {
			video_attrs.video_src = $("input[name=video_src]").val();
			video_attrs.subs_url = $("input[name=subs_file]").val();
		}
		if ($("input[name=video_src]").val() === "") {
			video_attrs.video_src = $("input[name=local_video_mobile]").val();
			video_attrs.subs_url = $("input[name=subs_file_mobile]").val();
		}
		$player_wrapper = $("#player_wrapper");
		$player_wrapper.html(generate_player_code(video_attrs.video_src, video_attrs.video_type, video_attrs.subs_url));
		init_player_ui();
		$('.fp-ui').click(function(event) {
			var trueWhite = $('.container').hasClass('containerBecomeWhite');
			if (trueWhite === true) {
				$('.container').removeClass('containerBecomeWhite');
				$('.container').addClass('containerBecomeBlack');
				console.log('black');
			}
			if (trueWhite === false) {
				$('.container').removeClass('containerBecomeBlack');
				$('.container').addClass('containerBecomeWhite');
				console.log('white');;
			}
		});
		if ($player_wrapper.hasClass("flash")) {
			$(".myplayer").flowplayer({
				engine: "flash"
			})
		} else if ($player_wrapper.hasClass("native")) {
			$video = $("video");
			$video.attr("controls", true);
			$video.css("width", "100%");
			return
		} else {
			$(".myplayer").flowplayer({})
		}
		calculate_base_fontsize();
		flowplayer.conf.subtitles_shift = 0;
		/* $("#player_ui_wrapper").slideDown(); */
		$("#player_widgets").slideDown();
		$("#ui_translation_font input").trigger("change");
		$("#ui_subtitles_font input").trigger("change");
		$("#player_wrapper").css('width', '100%');
		var oldSubtitleWrap = $(".fp-subtitle-wrap").html();
		/* $(".fp-subtitle-wrap").remove();*/
		$("#new_place_for_subtitles").append(oldSubtitleWrap);
		$(".translation")[0].remove();
		$(".fp-fullscreen")[0].remove();
		$(".fp-time")[0].remove();
		$(".fp-controls")[0].remove();
		$(".fp-help")[0].remove();
	});
	$("#clear_new_words").click(function(event) {
		event.preventDefault();
		new_words = {};
		$("#words_list").html("");
		print_new_words();
	});
$("#btnChangeVideo").click(function(event) {
	$("#form_wrapper").slideDown();
});
$("#btnChangeVideo-2").click(function(event) {
	$("#form_wrapper").slideDown();
});
$("#pIfPc").click(function(event) {
	$(".first_buttons").slideUp();
	$(".for_pc").slideDown();
});
$("#pIfMobile").click(function(event) {
	$(".first_buttons").slideUp();
	$(".for_mobile").slideDown();
});	
$("#copy_words").click(function(event) {
	var copyAll = $('#words_list').html();
	prompt('���������� ����� ���� ��� Ctrl+C', copyAll)
});	

$("#change_video_and_sub").click(function(event) {
	//*http://localhost:8080
	var srcAll = prompt('������� ��� ����� ��� ����������.') ;
	var srcVideo = 'http://localhost:8080/' + srcAll + '.mp4';
	var srcSub = 'http://localhost:8080/' + srcAll + '.srt';
	$("input[name=local_video_mobile]").val(srcVideo);
	$("input[name=subs_file_mobile]").val(srcSub);
});	
	});