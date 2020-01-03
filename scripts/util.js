function sleep(delay) {
    var start = (new Date().getTime()) / 1000;
    while (
        (new Date().getTime()) / 1000 < start + delay
    );
}
