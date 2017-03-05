package net.ngeor.t3.players;

import android.content.Context;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Vibrator;
import android.view.MotionEvent;
import android.view.View;
import net.ngeor.t3.models.*;

/**
 * Represents the human player.
 * Created by ngeor on 2/10/2017.
 */
public class HumanPlayer extends AbstractPlayer implements View.OnTouchListener, GameModelListener {
    private final Context context;

    public HumanPlayer(Context context, GameModel model, PlayerSymbol turn) {
        super(model, turn);
        this.context = context;
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        final GameModel model = getModel();
        if (model.getState() != GameState.WaitingPlayer || !isMyTurn()) {
            return false;
        }

        if (event.getAction() == MotionEvent.ACTION_UP) {
            int col = (int) (model.getBoardModel().getCols() * event.getX() / v.getWidth());
            int row = (int) (model.getBoardModel().getRows() * event.getY() / v.getHeight());
            TileState tileState = model.getBoardModel().getTileState(row, col);
            if (tileState == TileState.EMPTY) {
                model.play(row, col);
                notifyHumanPlayed();
            } else {
                notifyHumanCannotPlayHere();
            }
        }

        return true;
    }

    @Override
    public void stateChanged() {
        if (canIPlay()) {
            notifyHumanCanPlay();
        }
    }

    private void notifyHumanCannotPlayHere() {
        Vibrator vibrator = (Vibrator)context.getSystemService(Context.VIBRATOR_SERVICE);
        vibrator.vibrate(500);
    }

    private void notifyHumanPlayed() {
    }

    private void notifyHumanCanPlay() {
        // play a sound when the human player needs to play, but only on invisible mode
        if (getModel().getSettings().isInvisibleMode()) {
            Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            Ringtone ringtone = RingtoneManager.getRingtone(context, uri);
            ringtone.play();
        }
    }
}
