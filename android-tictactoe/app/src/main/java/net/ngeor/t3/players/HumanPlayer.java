package net.ngeor.t3.players;

import android.content.Context;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Vibrator;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.models.PlayerSymbol;

/**
 * Represents the human player.
 * Created by ngeor on 2/10/2017.
 */
public class HumanPlayer extends AbstractPlayer implements View.OnTouchListener, GameModelListener {
    private final Context context;
    private final MutableGameModel model;

    public HumanPlayer(Context context, MutableGameModel model, PlayerSymbol turn) {
        super(turn);
        this.context = context;
        this.model = model;
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("HumanPlayer", "onTouch " + event);

        if (event.getAction() != MotionEvent.ACTION_UP) {
            return true;
        }

        Log.d("HumanPlayer", "onTouch");
        if (!canIPlay(model)) {
            return false;
        }

        int col = (int) (model.getBoardModel().getCols() * event.getX() / v.getWidth());
        int row = (int) (model.getBoardModel().getRows() * event.getY() / v.getHeight());
        PlayerSymbol tileState = model.getBoardModel().getTileState(row, col);
        if (tileState == null) {
            model.play(row, col);
            notifyHumanPlayed();
        } else {
            notifyHumanCannotPlayHere();
        }

        return true;
    }

    @Override
    public void stateChanged(MutableGameModel model) {
        if (canIPlay(model)) {
            notifyHumanCanPlay(model);
        }
    }

    private void notifyHumanCannotPlayHere() {
        Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        vibrator.vibrate(500);
    }

    private void notifyHumanPlayed() {
    }

    private void notifyHumanCanPlay(GameModel model) {
        // play a sound when the human player needs to play, but only on invisible mode
        if (model.getSettings().isInvisibleMode()) {
            Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            Ringtone ringtone = RingtoneManager.getRingtone(context, uri);
            if (ringtone != null) {
                ringtone.play();
            }
        }
    }
}
